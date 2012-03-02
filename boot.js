var gh = require('grasshopper');

gh.configure({
    viewsDir: './views',
    layout: 'layout',
    locales: require('./locales')
});

[
    './controllers/home',
    './controllers/userList',
    './controllers/requestLog',
    './controllers/user',
    './controllers/songtop',

].forEach(function(controller) {
    require(controller);
});

gh.serve(8084);
