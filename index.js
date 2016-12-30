'use strict';

var redis = require('redis');

var IPRange = {};

var defaultPort = 6379;
var defaultHost = '127.0.0.1';
var iprangekey = 'iprangekey';

var redisClient;

IPRange.configure = function(port, host, options) {
    port = port || 6379;
    host = host || '127.0.0.1';

    redisClient = redis.createClient(port, host, options);
};

function _checkRedisClient() {
    if(!redisClient){
        redisClient = redis.createClient(defaultPort, defaultHost);
    }
}

//to prevent same members
function makeid(timems){
    var text = ";";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return timems+text;
}

function toNumber(ip){
    if(ip.length < 8)
        return null;

    var ipsplit = ip.split('.');
    return (ipsplit[0] * 256 * 256 * 256) + (ipsplit[1] * 256 * 256) + (ipsplit[2] * 256) + (ipsplit[3] * 1);
}

IPRange.getData = function(ip, callback) {

    _checkRedisClient();

    var ipNumber = toNumber(ip);
    
    var args = [ iprangekey, ipNumber, '+inf', 'limit', 0, 1 ];
    redisClient.zrangebyscore(args, function (err, response) {
        if(response != null && response.toString().indexOf(";") !== -1 ){
            var res = response[0];
            var result = res.split(';')[0]+';' + res.split(';')[1];
            return callback(null, result);
        }else
            return callback(err, response);
    });
};

IPRange.writeRange = function(ipRangeEnd, metadata, callback) {

    _checkRedisClient();

    var args = [ iprangekey, ipRangeEnd , makeid(metadata)];
    redisClient.zadd(args, function (err, response) {
        return callback(err, response);
    });

};

module.exports = IPRange;
