var	gh = require('../path').gh,
    topRepo = require('../repositories/songtops'),
    Top = require('../models').Top;

 
gh.get('/admin/songtop/{id}', function(args) {
    var self = this;
    topRepo.get(args.id, function(err, p) {
        self.model['tops'] = p;
        self.model['name'] = args.id;
        self.render('index');
    });
});
 