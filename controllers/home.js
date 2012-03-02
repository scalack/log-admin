var	db_util = require('../repositories/db_util'),
		gh = require('../path').gh;
		
gh.addFilters(/\/admin\/[^login]/, function(nextFilter) {
    var self = this;
    this.getSessionValue('username', function(err, user) {
        if(!err && user) {
            nextFilter();
        } else {
            self.renderError(403);
        }
    });
});

gh.get('/admin', function() {
	  this.disableCache();
    var self = this;
    this.getSessionValue('username', function(err, username) {
        if(!err && username) {
             self.model['username'] = username;
             self.redirect('/admin/songtop/all');
        } else {
             self.render('login');
        }
    });
});


gh.post('/admin/login', function() {
    var self = this;
    var client = db_util.getClient();
    var name = this.params['name'];
    var password = this.params['password'];
    client.hget("users:"+ name,'password',function(err,data){
    		if(password === data){
      		self.setSessionValue('username',name, function() {
      			self.redirect('/admin');
    			});	
         
        }else{
        	self.flash['executionSuccess'] = 'not found the user!!';
          self.redirect('/admin');
        }
    });
		
});

gh.get('/admin/logout', function() {
    var self = this;
    this.endSession(function() {
    		self.flash['executionSuccess'] = 'log out successfully!!';
        self.redirect('/admin');
    });
});