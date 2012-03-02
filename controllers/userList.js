var	gh = require('../path').gh,
    userListRepo = require('../repositories/userList'),
    UserList = require('../models').UserList;

gh.get('/admin/userlist', function() {
    var self = this;
    userListRepo.all(function(err, p) {
        self.model['userLists'] = p;
        self.render('userLists/index');
    });
});


gh.post('/admin/userlist/{id}/delete', function(args) {
    var self = this;
    userListRepo.remove(args.id, function(err, p) {
             self.redirect('/admin/userlist');
     });
});

gh.get('/admin/userlist/add', function() {
    this.model['userLists'] = new UserList();
    this.render('userLists/add');
});

gh.post('/admin/userlist', function() {
    var p = new UserList().update(this.params['userLists']);
    var self = this;
    
    if(!p.name()) {
        this.model['userLists'] = p;
        this.render('userLists/add');
    } else {
        userListRepo.save(p, function() {
            self.flash['userListsSuccess'] = 'Execution was saved successfully!';
            self.redirect('/admin/userlist');
        });
    }
});