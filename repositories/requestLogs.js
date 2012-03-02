var client = require('./db_util').getClient(),
    RequestLog = require('../models').RequestLog,
    Item = require('../models').Item,
    Set = require('../models').Set;

var counts = [];
exports.all = function(pageNum,pageSize,cb) {
    var rets = [];
    var start = pageNum*pageSize+1;
    for(var i=0;i<pageSize;i++){
     counts.push(i);
    }
    counts.forEach(function(pos) {
     client.get("logid:"+(start+pos),function(err, d) {
     	   if(d) rets.push(toRequestLog("logid:"+(start+pos),d));
       		 if(pos===pageSize-1)	cb(err,rets);
    	});
    });
  
};

exports.get = function(pageNum,pageSize,name,cb) {
    var objs = [];
    var start = pageNum*pageSize;
    var stop = start + pageSize - 1;
  
    client.lrange("user:"+name,start,stop,function(err, vals) {
    	   if(vals.length === 0 )  cb(err,[]);
    	   vals.forEach(function(key,pos) {
    									client.get(key,function(e,d){
       								   if(d) objs.push(toRequestLog(name,d));
       								  		  if(pos === vals.length-1)		 cb(e,objs);
   									    });
  	    });
    });
   
};
exports.search = function(name,face,time,cb) {
    var set = new Set(function(key){return "set:"+key}),item = new Item();

    if('all'===name){
     client.keys("time:*:"+face+":"+time,function(err, keys) {
     if(keys.length === 0 ) {
    	 			 item.face(face).time(time).req_sum(0).ip_sum(0);
    	 			 cb(err,item);
     }
     	 keys.forEach(function(key,pos) {
     	 	client.lrange(key,0,-1,function(err, rets) {
     	 		rets.forEach(function(row,pos) {
     	 			client.get(row,function(e,d){
     	 			 				   if(d)  set.add(d.split(",")[0]);
       			 					  		  if(pos === rets.length-1)	{
       								  		    item.face(face).time(time).req_sum(rets.length).ip_sum(set.map.size());	
       								  		    cb(err,item);
       								  		  }
   		     });
    	     	
    	     });
    	    
     	 	});
    	});   
    });
  }else{
    client.lrange("time:"+name+":"+face+":"+time,0,-1,function(err, rets) {
    	 		if(rets.length === 0 ) {
    	 			 item.face(face).time(time).req_sum(0).ip_sum(0);
    	 			 cb(err,item);
    	 		 }
    	     rets.forEach(function(row,pos) {
    	     	client.get(row,function(e,d){
       								   if(d)  set.add(d.split(",")[0]);
       			 					  		  if(pos === rets.length-1)	{
       								  		    item.face(face).time(time).req_sum(rets.length).ip_sum(set.map.size());	
       								  		    cb(err,item);
       								  		  }
   		     });
    	     
    	     });
    	      
    });
   }
};



function toRequestLog(name,row) {
    var requestLog = new RequestLog();
    var cols = row.split(",");
    requestLog.ip(cols[0]).interface_type(cols[1]).req_time(cols[2]).name(name);
    return requestLog;
}
