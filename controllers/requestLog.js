var	gh = require('../path').gh,
	  db_util = require('../repositories/db_util'),
    requestLogRepo = require('../repositories/requestLogs'),
    Item = require('../models').Item;
    
var pageSize = 40;
gh.get('/admin/requestlogs', function() {
    var self = this;
    requestLogRepo.all(0,pageSize,function(err, p) {
    		self.model['page'] = 0;
    		self.model['name'] = "all";
        self.model['requestLogs'] = p;
         self.model['ret'] = 0;
        self.render('requestLogs/index');
    });
});
gh.get('/admin/requestlogs/page/{no}/{name}', function(args) {
    var self = this;
    if(args.name==='all')
        	requestLogRepo.all(args.no,pageSize,function(err, p) {
    		self.model['page'] = args.no;
    		self.model['name'] = "all";
    		self.model['ret'] = 0;
        self.model['requestLogs'] = p;
        self.render('requestLogs/index');
    });
   
    requestLogRepo.get(args.no,pageSize,db_util.crypto(args.name),function(err, p) {
    		self.model['page'] = args.no;
    		self.model['name'] = args.name;
    		self.model['ret'] = 0;
        self.model['requestLogs'] = p;
        self.render('requestLogs/index');
    });
});


gh.get('/admin/requestlogs/{name}', function(args) {
    var self = this;
    requestLogRepo.get(0,pageSize,db_util.crypto(args.name),function(err, p) {
    		self.model['page'] = 0;
    		self.model['name'] = args.name;
        self.model['requestLogs'] = p;
        self.model['ret'] = 0;
        self.render('requestLogs/index');
    });
});

gh.post('/admin/requestlogs/search', function() {
	 var self = this;
	 var tag = db_util.crypto(this.params['tag']);
	 if(this.params['tag']==='all')
	 tag = this.params['tag'];
	 requestLogRepo.search(tag,this.params['face'],this.params['time'],function(err, p) {
	 
	  		 self.model['ret'] = p;
    		 self.model['requestLogs'] = [];
    		 self.model['page'] = 0;
    		 self.model['name'] = self.params['tag'];
   			 self.model['face'] = self.params['face'];
        self.render('requestLogs/index');
    });
   
});