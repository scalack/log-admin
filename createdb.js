var r = require('redis').createClient(6379,'172.27.1.189');
r.auth('foobared');
r.set('name','jack');

	r.get('name',function(err,data){
		console.log(data);
	});
~
