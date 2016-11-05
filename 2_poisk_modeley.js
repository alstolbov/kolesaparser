var fs = require('fs');
var util = require('util');
var request = require('superagent');
var async = require('async');
var csv = require('fast-csv');

var logFile = fs.createWriteStream('data/marki_i_modeli.csv', { flags: 'w+' });
var logger = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
};

var stream = fs.createReadStream("data/marki.csv");

var url = 'http://www.kolesa-darom.ru/netcat/podbor.php?key=';

var _RES = [];
var tmpObj = [];
var iter = 0;

var getItems = function (item, callback) {
  console.log(item);
  request
    .get(url+item.marka_key)
    .end(function (err, res) {
      if (!err) {
        var data = res.body.items;
        _RES[item.id] = {
          marka_name: item.marka_name,
          marka_key: item.marka_key,
          modely: data,
        };
        iter++;
        callback();
      }
    })
  ;
};

var writeItems = function () {
  iter = 0;
  _RES.map(function (marka) {
    Object.keys(marka.modely).map(function (modelName) {
      var data = marka.marka_key + '|' +
        marka.marka_name + '|' +
        marka.modely[modelName] + '|' +
        modelName
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
      marka_name: data[0],
      marka_key: data[1],
      id: tmpObj.length,
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
        console.log('Modeley', iter);
      }
    );
  })
;

stream.pipe(csvStream);
