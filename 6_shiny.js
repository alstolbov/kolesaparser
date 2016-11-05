var fs = require('fs');
var util = require('util');
var request = require('superagent');
var async = require('async');
var csv = require('fast-csv');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var logFile = fs.createWriteStream('data/marki_modeli_kuzova_gody_modific_shiny_pcd.csv', { flags: 'w+' });
var logger = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
};

var stream = fs.createReadStream("data/marki_modeli_kuzova_gody_modific.csv");

var url = 'http://www.kolesa-darom.ru/cheboksary-marposad/shiny/avto/';

var _RES = [];
var tmpObj = [];
var iter = 0;


var getItems = function (item, callback) {
  console.log(item.id);
  request
    .get(url+encodeURI(item.link))
    .end(function (err, res) {
    	if (err) {
    		console.log(iter, 'err', url+encodeURI(item.link));
    		console.log(err);
    	} else {
    		// console.log(res.text);
        // iconv.decode(res.text, 'win1251')
    		var $ = cheerio.load(res.text, {decodeEntities: false});
    		var parseRes = [];
    		var parseRes2 = [];
        var pcd = [];
    		$('.recom-wh').each(function (i, bl) {
	    		$(this).find('ul.opts-choice').each(function (i1, elem) {
	    			var tmpItemRes = '';
	    			$(this).find('li a').each(function (i2, el) {
	    				tmpItemRes += $(this).text() + '#';
	    			});
	    			parseRes.push(tmpItemRes.slice(0, -1));
	    		});
	    		$(this).find('ul.opts-choice1').each(function (i1, elem) {
	    			var tmpItemRes = '';
	    			$(this).find('li a').each(function (i2, el) {
	    				tmpItemRes += $(this).text() + '#';
	    			});
	    			parseRes2.push(tmpItemRes.slice(0, -1));
	    		});
          $(this).find('.recom-wh-top p').each(function (i3, elem) {
            // console.log($(this).text())
            pcd.push($(this).text().replace('������� ', ''));
          });
	    	});
			  var tmpItem = {
			  	marka_name: item.marka_name,
			  	model_name: item.model_name,
			  	kuzov_name: item.kuzov_name,
			  	god: item.god,
			  	modific: item.modific,
			  	parse: parseRes,
			  	parse_raznoshir: parseRes2,
          parse_PCD: pcd[0] || pcd[1]
			  };
				_RES[item.id] = tmpItem;

		    var data = tmpItem.marka_name + '|' +
		      tmpItem.model_name + '|' +
		      (tmpItem.kuzov_name || '') + '|' +
		      (tmpItem.god || '') + '|' +
		      (tmpItem.modific || '') + '|' +
		      (tmpItem.parse[0] || '') + '|' +
		      (tmpItem.parse[1] || '') + '|' +
		      (tmpItem.parse_raznoshir[0] || '') + '|' + 
		      (tmpItem.parse_raznoshir[1] || '') + '|' + 
		      (tmpItem.parse[2] || '') + '|' +
		      (tmpItem.parse[3] || '') + '|' +
		      (tmpItem.parse_raznoshir[2] || '') + '|' + 
		      (tmpItem.parse_raznoshir[3] || '') + '|' +
          (tmpItem.parse_PCD || '')
		    ;
		    iter++;
		    logger(data);
				callback();
    	}
    })
   ;

};

var writeItems = function () {
  iter = 0;
  _RES.map(function (modely) {
    var data = modely.marka_name + '|' +
      modely.model_name + '|' +
      (modely.kuzov_name || '') + '|' +
      (modely.god || '') + '|' +
      (modely.modific || '') + '|' +
      (modely.parse[0] || '') + '|' +
      (modely.parse[1] || '') + '|' +
      (modely.parse_raznoshir[0] || '') + '|' + 
      (modely.parse_raznoshir[1] || '') + '|' + 
      (modely.parse[2] || '') + '|' +
      (modely.parse[3] || '') + '|' +
      (modely.parse_raznoshir[2] || '') + '|' + 
      (modely.parse_raznoshir[3] || '') 
    ;
    iter++;
    logger(data);
  });
};

var csvStream = csv
  .parse({delimiter: '|'})
  .on("data", function(data){
  	var from = 0;
  	if (iter >= from) {
	    tmpObj.push({
	      id: tmpObj.length,
	      marka_name: data[0],
	      model_name: data[1],
	      kuzov_name: data[2] || false,
	      god: data[3] || false,
	      modific: data[4] || false,
	      link: data[5],
	    });
	  }
    iter++;
  })
  .on("end", function(){
  	iter = 0;
    async.mapLimit(
      tmpObj,
      1,
      getItems,
      function (err) {
        console.log('Total', tmpObj.length);
        console.log('Obrabotano', iter);
        // writeItems();
        // console.log('Naydeno', iter);
      }
    );
  })
;

stream.pipe(csvStream);
