var	gh = require('../path').gh,
    userRepo = require('../repositories/users'),
    User = require('../models').User;

gh.get('/admin/users', function() {
    var self = this;
    userRepo.all(function(err, p) {
        self.model['users'] = p;
        self.render('users/index');
    });
});

gh.get('/admin/users/add', function() {
    this.model['user'] = new User();
    this.render('users/add');
});

gh.get('/admin/users/{id}/edit', function(args) {
    var self = this;
    userRepo.get(args.id, function(err, p) {
        self.model['user'] = p;
        self.render('users/edit');
    });
});

gh.post('/admin/users', function() {
    var p = new User().update(this.params['user']);
    var self = this;
    if(!p.isValid()) {
        this.model['user'] = p;
        this.render('users/add');
    } else {
        userRepo.save(p, function() {
            self.flash['executionSuccess'] = 'Execution was saved successfully!';
            self.redirect('/admin/users');
        });
    }
});

gh.post('/admin/users/{id}/update', function(args) {
    var self = this;
    userRepo.get(args.id, function(err, p) {
        p.update(self.params['user']);
        if(!p.isValid()) {
            self.model['user'] = p;
            self.render('users/edit');
        } else {
            userRepo.save(p, function() {
                self.flash['executionSuccess'] = 'Execution was saved successfully!';
                self.redirect('/admin/users');
            });
        }
    });
});

gh.post('/admin/users/{id}/delete', function(args) {
	  var self = this;
    userRepo.remove(args.id, function() {
            self.redirect('/admin/users');
        });
  
});
