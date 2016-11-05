var fs = require('fs');
var util = require('util');

var async = require('async');
var csv = require('fast-csv');
var cheerio = require('cheerio');

var logFile = fs.createWriteStream('data/test.csv', { flags: 'w+' });
var logger = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
};

// var stream = fs.createReadStream("dat a/marki_modeli_kuzova_gody_modific.csv");

// var url = encodeURI('http://www.kolesa-darom.ru/shiny/avto/Audi/100/1984/2.0D (44)/#ds');
// var request = require('superagent');
// var url = encodeURI('http://www.kolesa-darom.ru/cheboksary-marposad/shiny/avto/Acura/MDX/2004/Cross_3.5%20i/#ds');
// var _RES = [];
// var tmpObj = [];
// var iter = 0;

// var _request = function (link, clbk) {
//   request
//     .get(encodeURI(link))
//     .end(function (err, res) {
//       if (err) {
//         console.log('ERROR!', link);
//         _request(err.response.redirects[0]);
//       } else {
//         console.log(res.text);
//       }
//     })
//   ;
// };
// _request('http://www.kolesa-darom.ru/cheboksary-marposad/shiny/avto/Acura/MDX/2004/Cross_3.5%20i/');


process.setMaxListeners(0)
var request = require('request');
var url = 'http://kolesa-darom.ru';
var headers = { 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    // 'Content-Type' : 'application/html' 
};

request.get({ url: url, headers: headers }, function (e, r, body) {
    
    console.log(e);
    console.log(r);
    console.log(body);
});




// var request = require('request');
// request('http://www.kolesa-darom.ru/cheboksary-marposad/shiny/avto/Acura/MDX/2004/Cross_3.5%20i/', function (error, response, body) {
//   console.log(error);
//   console.log(response);
//   console.log(body);
// });





// var http = require('http');
// var options = {
//   host: 'www.kolesa-darom.ru',
//   port: 80,
//   path: '/'
// };
// http.get(options, function(res) {
//   console.log("Got response: " + res.statusCode);

//   res.on("data", function(chunk) {
//     console.log("BODY: " + chunk);
//   });
// }).on('error', function(e) {
//   console.log("Got error: " + e.message);
// });





  // request
  //   .get(url)
  //   .end(function (err, res) {
  //   	if (err) {
  //   		console.log(iter, 'err', url);
  //   		console.log(err);
  //   	} else {
  //   		// console.log(res.text);
  //   		var $ = cheerio.load(res.text);
  //       var parseRes = [];
  //       var parseRes2 = [];
  //       $('.recom-wh').each(function (i, bl) {
  //         console.log(i);
  //        $(this).find('ul.opts-choice').each(function (i1, elem) {
  //          var tmpItemRes = '';
  //          $(this).find('li a').each(function (i2, el) {
  //            tmpItemRes += $(this).text() + '#';
  //          });
  //          parseRes.push(tmpItemRes.slice(0, -1));
  //        });
  //        $(this).find('ul.opts-choice1').each(function (i1, elem) {
  //          var tmpItemRes = '';
  //          $(this).find('li a').each(function (i2, el) {
  //            tmpItemRes += $(this).text() + '#';
  //          });
  //          parseRes2.push(tmpItemRes.slice(0, -1));
  //        });
  //       });
  //       var tmpItem = {
  //        parse: parseRes,
  //        parse_raznoshir: parseRes2
  //       };

  //       var data = 
  //         (tmpItem.parse[0] || '') + '|' +
  //         (tmpItem.parse[1] || '') + '|' +
  //         (tmpItem.parse_raznoshir[0] || '') + '|' + 
  //         (tmpItem.parse_raznoshir[1] || '') + '|' + 
  //         (tmpItem.parse[2] || '') + '|' +
  //         (tmpItem.parse[3] || '') + '|' +
  //         (tmpItem.parse_raznoshir[2] || '') + '|' + 
  //         (tmpItem.parse_raznoshir[3] || '') 
  //       ;
  //       iter++;
  //       logger(data);
  //       logger(res.text);      }
  //   })
  // ;

  //   		var parseRes = [];
  //   		var parseRes2 = [];
  //   		$('.recom-wh').each(function (i, bl) {
	 //    		$(this).find('ul.opts-choice').each(function (i1, elem) {
	 //    			var tmpItemRes = '';
	 //    			$(this).find('li a').each(function (i2, el) {
	 //    				tmpItemRes += $(this).text() + '#';
	 //    			});
	 //    			parseRes.push(tmpItemRes.slice(0, -1));
	 //    		});
	 //    		$(this).find('ul.opts-choice1').each(function (i1, elem) {
	 //    			var tmpItemRes = '';
	 //    			$(this).find('li a').each(function (i2, el) {
	 //    				tmpItemRes += $(this).text() + '#';
	 //    			});
	 //    			parseRes2.push(tmpItemRes.slice(0, -1));
	 //    		});
	 //    	});
		// 	  var tmpItem = {
		// 	  	parse: parseRes,
		// 	  	parse_raznoshir: parseRes2
		// 	  };

		//     var data = 
		//       (tmpItem.parse[0] || '') + '|' +
		//       (tmpItem.parse[1] || '') + '|' +
		//       (tmpItem.parse_raznoshir[0] || '') + '|' + 
		//       (tmpItem.parse_raznoshir[1] || '') + '|' + 
		//       (tmpItem.parse[2] || '') + '|' +
		//       (tmpItem.parse[3] || '') + '|' +
		//       (tmpItem.parse_raznoshir[2] || '') + '|' + 
		//       (tmpItem.parse_raznoshir[3] || '') 
		//     ;
		//     iter++;
		//     logger(data);
  //       logger(res.text);
  //   	}
  //   })
  //  ;
