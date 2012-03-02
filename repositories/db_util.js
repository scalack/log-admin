var redis = require('../path').redis,
   password = 'foobared';

exports.getClient = function() {
    var client = redis.createClient(6379,'localhost');
    client.auth(password);
    return client;
}

exports.mapRows = function(rows, mapper) {
    if(rows == undefined) return undefined;

    var objs = [];
    rows.forEach(function(row) {
        objs.push(mapper(row));
    });

    return objs;
}

exports.combineAndMap = function(rows, keyColumn, mapper) {
    if(rows == undefined) return undefined;

    var rowSets = {};
    rows.forEach(function(row) {
        var key = row[keyColumn];
        if(rowSets[key] == undefined) {
            rowSets[key] = [];
        }
        rowSets[key].push(row);
    });

    var objs = [];
    for(var key in rowSets) {
        objs.push(mapper(rowSets[key]));
    }
    return objs;
}
exports.crypto = function(text){
		var cr = require('crypto');
    var hash = cr.createHash('md5');
    hash.update(text);
	  return hash.digest('base64').replace(/\+/g,'_').replace(/==$/,"");
}

exports.mapAddRows = function(rows,objs,mapper) {
    if(rows == undefined) return undefined;
  
    rows.forEach(function(row) {
        objs.push(mapper(row));
    });

    return objs;
}