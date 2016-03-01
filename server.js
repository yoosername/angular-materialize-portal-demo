const express = require('express');
const bodyParser = require('body-parser')
const LocalStorage = require('node-localstorage').LocalStorage;

const app = express();
const localStorage = new LocalStorage(__dirname + '/data');

// Static routes used by angular single page app
app.use('/lib', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/img', express.static(__dirname + '/app/img'));
app.use('/partials', express.static(__dirname + '/app/partials'));

// Parse json in api calls
app.use(bodyParser.json({ type: 'application/json' }))


// Serve Static Index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/index.html')
})

// TEST API ROUTES
// get localstorage for projects key
var projects = new localStorageConnector("projects");

// create new project
app.post('/api/projects', (req, res) => {
  var newProject = req.body || {};
  console.log("POST: /api/projects: " + JSON.stringify(newProject));
  var created = projects.save(newProject);
  handle(created, res, 400, "couldnt create new project");
})

// update existing project
app.put('/api/projects/:id', (req, res) => {
  var newProject = req.body || {};
  console.log("PUT: /api/projects/" + req.params.id + " : " + JSON.stringify(newProject));
  var updated = projects.update(req.params.id, newProject);
  handle(updated, res, 404, "that project id doesnt exist");
})

// delete existing project
app.delete('/api/projects/:id', (req, res) => {
  console.log("DELETE: /api/projects/" + req.params.id);
  var deleted = projects.delete(req.params.id);
  handle(deleted, res, 404, "that project id doesnt exist");
})

// get all projects
app.get('/api/projects', (req, res) => {
  console.log("GET: /api/projects");
  var all = projects.getAll();
  handle(all, res, 204, "there are no projects yet");
})

// get single project
app.get('/api/projects/:id', (req, res) => {
  console.log("GET: /api/projects/" + req.params.id);
  var project = projects.get(req.params.id);
  handle(project, res, 404, "that project doesnt exist");
})

// get localstorage for accounts key
var accounts = new localStorageConnector("accounts");

// create new account
app.post('/api/accounts', (req, res) => {
  var newAccount = req.body || {};
  console.log("POST: /api/accounts: " + JSON.stringify(newAccount));
  var created = accounts.save(newAccount);
  handle(created, res, 500, "couldnt create new account");
})

// update existing account
app.put('/api/accounts/:id', (req, res) => {
  var newAccount = req.body || {};
  console.log("PUT: /api/accounts/" + req.params.id + " : " + JSON.stringify(newAccount));
  var updated = accounts.update(req.params.id, newAccount);
  handle(updated, res, 404, "that account doesnt exist yet");
})

// delete existing project
app.delete('/api/accounts/:id', (req, res) => {
  console.log("DELETE: /api/accounts/" + req.params.id);
  var deleted = accounts.delete(req.params.id);
  handle(deleted, res, 404, "that account id doesnt exist");
})

// Get all accounts
app.get('/api/accounts', (req, res) => {
  console.log("GET: /api/accounts");
  var all = accounts.getAll();
  handle(all, res, 204, "there are no accounts yet");
})

// Get single account
app.get('/api/accounts/:id', (req, res) => {
  console.log("GET: /api/accounts/" + req.params.id);
  var account = accounts.get(req.params.id);
  handle(account, res, 404, "that account doesnt exist");
})

// get localstorage for accounts key
var password = new localStorageConnector("password");

// create new password
app.post('/api/password', (req, res) => {
  var newPassword = req.body.password || {};
  console.log("POST: /api/password: " + JSON.stringify(newPassword));
  var reset = password.saveOne(newPassword);
  handle({reset:true}, res, 500, "couldnt reset password");
})

// catch all for blowing away test data
app.get('/api/data/delete', (req, res) => {
  console.log("GET: /api/data/delete");
  localStorage.clear();
  handle({deleted:true}, res);
})

// Start listening
app.listen(8000, function() {
  console.log('listening on 8000')
})



// Utility for interacting with local storage
function localStorageConnector(key){

  this.key = key;
  this.id = 0;

  this.get = function(id){
    var objs = this.getAll();
    if(objs){
      for(var i=0; i<objs.length; i++){
        console.log(objs);
        if(objs[i].id == id){
          return JSON.stringify(objs[i]);
        }
      }
    }
    return null;
  }

  this.getAll = function(){
    return JSON.parse(localStorage.getItem(key)) || null;
  }

  this.save = function(obj){
    var objs = this.getAll() || [];
    if(objs){
      obj = Object.assign({}, obj, {
        "id": this.id++,
        "created": new Date().getTime()
      });
      objs.push(obj);
      localStorage.setItem(key, JSON.stringify(objs));
      return obj;
    }
  }

  this.saveOne = function(obj){
    localStorage.setItem(key, JSON.stringify(obj));
    return true;
  }

  this.update = function(id, obj){
    var objs = this.getAll();
    for(var i=0; i<objs.length; i++){
      if(objs[i].id == id){
        var newObj = Object.assign({}, obj, {
          "id": objs[i].id,
          "updated": new Date().getTime()
        });
        objs[i] = newObj;
        localStorage.setItem(key, JSON.stringify(objs));
        return newObj;
      }
    }
    return null;
  }

  this.delete = function(id){
    var objs = this.getAll();
    newObjs = objs.filter(function (el) {
      return el.id != id;
    });
    localStorage.setItem(key, JSON.stringify(newObjs));
    return newObjs;
  }

}

// Utility for handling different success / error json output
const handle = function(obj, res, code, msg){
  res.setHeader('Content-Type', 'application/json');
  if(obj && obj != null && obj != undefined){
    res
      .status(200)
      .send(obj);
  }else{
    res
      .status(code)
      .send({
        error : msg
      });
  }
}
