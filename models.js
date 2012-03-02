var	gh = require('./path').gh;

function User() {
}

User.prototype.validate = function() {
    this.validateRequired('name', true); // Avoid prefix
    this.validateRequired('password', false); // Avoid prefix
    this.validateRequired('email', true); // Avoid prefix
};

exports.User = gh.initModel(User, 'name','password','email');


function UserList() {
}

UserList.prototype.validate = function() {
    this.validateRequired('name', true); // Avoid prefix
    this.validateRequired('crypto', false); // Avoid prefix
};

exports.UserList = gh.initModel(UserList, 'name','crypto');


function RequestLog() {
}

RequestLog.prototype.validate = function() {
	  this.validateRequired('name', false); // Avoid prefix
    this.validateRequired('ip', false); // Avoid prefix
    this.validateRequired('interface_type', false); // Avoid prefix
    this.validateRequired('req_time', false); // Avoid prefix
};

exports.RequestLog = gh.initModel(RequestLog, 'name','ip','interface_type','req_time');

function Item() {
}

Item.prototype.validate = function() {
	  this.validateRequired('req_sum'); // Avoid prefix
    this.validateRequired('ip_sum'); // Avoid prefix
    this.validateRequired('face');
    this.validateRequired('time');
    
};

exports.Item = gh.initModel(Item, 'req_sum','ip_sum','face','time');

function Top(){}

Top.prototype.validate = function() {
	  this.validateRequired('songId'); // Avoid prefix
    this.validateRequired('songName'); // Avoid prefix
};

exports.Top = gh.initModel(Top, 'songId','songName');




function Map(){
    this.obj = {};
    this.count = 0;
}

Map.prototype.put = function(key, value){
    var oldValue = this.obj[key];
    if(oldValue == undefined){
        this.count++;
    }
    this.obj[key] = value;
    return oldValue;
}

Map.prototype.get = function(key){
    return this.obj[key];
}

Map.prototype.remove = function(key){
    var oldValue = this.obj[key];
    if(oldValue != undefined){
        this.count--;
        delete this.obj[key];
    }
    return oldValue;
}

Map.prototype.size = function(){
    return this.count;
}

function Set(getKey){
    this.map = new Map();
    this.getKey = getKey;
}

Set.prototype.add = function(value){
    var key = this.getKey(value);
    this.map.put(key, value);
}
exports.Set = Set;