var ipRangers = require('./index');

var fs = require('fs');

var inputFile = '/Users/halil/Downloads/country_ip_blocks.csv';
var readStream = fs.createReadStream(inputFile);
readStream.setEncoding("utf8");
var lineReader = require('readline').createInterface({
  input: readStream,
  terminal: true
});

//5.47.166.40;87008808;5.47.166.59;87008827;TR;kirklareli
lineReader.on('line', function (line) {
	if(line.length > 1){
		var ipRanges = line.toString('utf8').split(';');
		ipRangers.writeRange( parseFloat(ipRanges[3]), ipRanges[4]+';'+ ipRanges[5], function(err, response){
			if(err)
	    		console.info(new Date().toISOString() + " response= " +response, err);
	    });
	}
});

ipRangers.getData( '5.47.166.39', function(err, response){
	console.info(" response= " +response, err);
});