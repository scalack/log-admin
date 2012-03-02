var db_util = require('./db_util'),
    Top = require('../models').Top,
    http = require('http'),
    sys = require('sys'),
    xml2js = require('../path').xml2js;
var url = "/music/song?ctx_productid=12&attrs=id,title&ids=";
     
exports.get = function(id, cb) {
    var client = db_util.getClient();
    var key = "song:incr:"+db_util.crypto(id);
    var i=0,rets=[];
    if('all'===id){
       cb("error",[]);
     }else{
      client.zrevrangebyscore(key,'+inf','-inf','LIMIT','0','100',function(err, vals) {
	    						if(vals.length === 0 )  cb(err,[]);
					  			  vals.forEach(function(row) {
					  			  	 http.get({host:'app.zx.duomi.com' ,port:80, path:url+row},function(re){
    								 	 re.setEncoding('utf8');
    										 var content = "";
     											re.on('data', function (da) {
     					 							 content += da;
  		 										 });
    										  re.on('end',function(){
    										  	var parser = new xml2js.Parser();
    										  	parser.addListener('end', function(result) {
     															 rets.push(toTop({songId:row,songName:result.song.title}));
					  			  							 if(++i===vals.length)  cb(err,rets);
									  				});
    									     parser.parseString(content);
   										 	  });
    									}).on('error',function(e){
    											console.log("err is :" + e);
   									 	});
					  			  	
					  			  });
        			  });
     }
};
 



function toTop(row) {
    var top = new Top();
    top.songId(row.songId).songName(row.songName);
    return top;
}
