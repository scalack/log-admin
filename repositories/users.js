var db_util = require('./db_util'),
    User = require('../models').User;

exports.all = function(cb) {
    var client = db_util.getClient();
    var i=0,rets=[];
    client.keys("users:*",function(err, keys) {
    				
    				if(keys.length === 0 )  cb(err,[]);
					  keys.forEach(function(row) {
					  		client.hget(row,'password',function(err, password) {
					  			  client.hget(row,'email',function(err, email) {
					  			 	rets.push(toUser({name:row.split(':')[1],password:password,email:email}));
        					   if(++i===keys.length)  cb(err,rets);
        					});
        			  });
    				});
    				
         
    });
};

exports.get = function(id, cb) {
    var client = db_util.getClient();
    var row = "users:"+id;
    var ret = [];
	  client.hget(row,'password',function(err, password) {
					  			  client.hget(row,'email',function(err, email) {
					  			  	ret.push(toUser({name:id,password:password,email:email}));
        					    cb(err,toUser({name:id,password:password,email:email}));
        					});
        			  });
};

exports.save = function(user, cb) {
    var client = db_util.getClient();
    var row = "users:"+user.name();
 	  client.hset(row,'password',user.password(),function(err, password) {
					  			  client.hset(row,'email',user.email(),function(err) {
        					  	cb(err);
        					});
        			  });
 
};

exports.remove = function(name, cb) {
	  var client = db_util.getClient();
    client.del("users:"+name,function(err) {
        					  	cb(err);
        					});
};



function toUser(row) {
    var user = new User();
    user.email(row.email).name(row.name).password(row.password);
    return user;
}
