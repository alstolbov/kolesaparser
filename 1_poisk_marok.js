var fs = require('fs');
var util = require('util');
var request = require('superagent');
var async = require('async');

var logFile = fs.createWriteStream('data/marki.csv', { flags: 'w+' });
var logger = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
};

var url = 'http://www.kolesa-darom.ru/netcat/podbor.php?key=autoSelect';

request
  .get(url)
  .end(function (err, res) {
    if (!err) {
      var data = res.body.items;
      Object.keys(data).map(function (key) {
        console.log(key + ' -> ' + data[key]);
        logger(key + '|' + data[key]);
      });
    }
  })
;
