var fs = require('fs');
var util = require('util');
var request = require('superagent');
var async = require('async');
var csv = require('fast-csv');

var logFile = fs.createWriteStream('data/marki_modeli_i_kuzova.csv', { flags: 'w+' });
var logger = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
};

var stream = fs.createReadStream("data/marki_i_modeli.csv");

var url = 'http://www.kolesa-darom.ru/netcat/podbor.php?key=';

var _RES = [];
var tmpObj = [];
var iter = 0;

var getItems = function (item, callback) {
  console.log(item.id);
  request
    .get(url+item.model_key)
    .end(function (err, res) {
      if (err) {
        console.log('!!!', item.id, item.marka_name, item.model_name);
        console.log(err);
      }
      if (!err) {
        var data = res.body.items;
        _RES[item.id] = {
          marka_name: item.marka_name,
          model_name: item.model_name,
          kuzova: data,
          kuzova_title: res.body.title,
        };
        iter++;
        callback();
      }
    })
  ;
};

var writeItems = function () {
  iter = 0;
  _RES.map(function (modely) {
    Object.keys(modely.kuzova).map(function (kuzovName) {
      var data = '';
      if (modely.kuzova_title == 'Кузов') {
        data = modely.marka_name + '|' +
          modely.model_name + '|' +
          // modely.kuzova_title + '|' +
          kuzovName + '|' +
          modely.kuzova[kuzovName]
        ;
      } else {
        data = modely.marka_name + '|' +
          modely.model_name + '|' +
          '|' +
          kuzovName + '|' +
          modely.kuzova[kuzovName]
        ;
      }
      iter++;
      logger(data);
    });
  });
};


var csvStream = csv
  .parse({delimiter: '|'})
  .on("data", function(data){
    tmpObj.push({
      id: tmpObj.length,
      marka_name: data[1],
      model_name: data[3],
      model_key: data[2],
    });
  })
  .on("end", function(){
    async.mapLimit(
      tmpObj,
      1,
      getItems,
      function (err) {
        console.log('Total', tmpObj.length);
        console.log('Obrabotano', iter);
        writeItems();
        console.log('Naydeno', iter);
      }
    );
  })
;

stream.pipe(csvStream);
