var db_util = require('./db_util'),
UserList = require('../models').UserList;

exports.all = function(cb) {
    var client = db_util.getClient();
    client.smembers("usernames",function(err, result) {
          cb(err, db_util.mapRows(result, toUserList));
    });
};

exports.remove = function(name, cb) {
    var client = db_util.getClient();
	 
    if(name != undefined) {
       client.lrem('userlist',0,db_util.crypto(name),
        	 function(err) {
            cb(err);
        	}
        );
       
       client.srem("usernames",name, function(err) {
            cb(err);
        });
    } else {
        cb();
    }
};


exports.save = function(userlist, cb) {
    var client = db_util.getClient();
 
    if(userlist.name() !== undefined) {
     	 client.sadd("usernames",userlist.name(), function(error) {
     	    cb(error);
     	 });
     	 client.lpush("userlist",db_util.crypto(userlist.name()), function(error) {
     	    cb(error);
     	 });
     	 client.bgsave();
    }
};


function toUserList(row) {
    var userList = new UserList();
    userList.name(row).crypto(db_util.crypto(row));
    return userList;
}
