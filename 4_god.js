var fs = require('fs');
var util = require('util');
var request = require('superagent');
var async = require('async');
var csv = require('fast-csv');

var logFile = fs.createWriteStream('data/marki_modeli_kuzova_gody.csv', { flags: 'w+' });
var logger = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
};

var stream = fs.createReadStream("data/marki_modeli_i_kuzova.csv");

var url = 'http://www.kolesa-darom.ru/netcat/podbor.php?key=';

var _RES = [];
var tmpObj = [];
var iter = 0;

var getItems = function (item, callback) {
  console.log(item.id);
  request
    .get(url+item.key)
    .end(function (err, res) {
      if (err) {
        console.log('!!!', item.id, item.marka_name, item.model_name, item.kuzov_name, item.god);
        console.log(err);
      }
      if (!err) {
        _RES[item.id] = {
          marka_name: item.marka_name,
          model_name: item.model_name,
          kuzov_name: item.kuzov_name,
          god: item.god,
          items: res.body.items,
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
    Object.keys(modely.items).map(function (itemName) {
      var data = modely.marka_name + '|' +
        modely.model_name + '|' +
        (modely.kuzov_name || '') + '|' +
        (modely.god || itemName) + '|' +
        (modely.god ? itemName : '') + '|' +
        modely.items[itemName]
      ;
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
      marka_name: data[0],
      model_name: data[1],
      kuzov_name: data[2] || false,
      god: data[4] ? data[3] : false,
      key: data[4] ? data[4] : data[3],
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
