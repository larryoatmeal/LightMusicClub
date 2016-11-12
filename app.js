#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var cors = require('cors');
var fileUpload = require('express-fileupload');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
// self.app.use(express.bodyParser.json())
app.use(bodyParser.json());
app.use(fileUpload());


var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var settings = require('./config/settings.js');
var mongoose = require('mongoose');

require('./config/passport')(passport);// pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'supersecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/**
 *  Define the sample application.
 */
var SampleApp = function() {

  //  Scope.
  var self = this;


  /*  ================================================================  */
  /*  Helper functions.                                                 */
  /*  ================================================================  */

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    self.port      = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };


    self.setUpMongo();
  };

  self.setUpMongo = function() {
    //for mongo
    self.connection_string = configDB.url;

    // if OPENSHIFT env variables are present, use the available connection info:
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
      self.connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
          process.env.OPENSHIFT_APP_NAME;
    }
    if(process.env.DBSTRING){
          self.connection_string = process.env.DBSTRING;
    }
    //console.log(self.connection_string);
    mongoose.connect(self.connection_string);

    self.db = mongojs(self.connection_string, ['books','songs', 'users']);
  };


  /**
   *  Populate the cache.
   */
  self.populateCache = function() {
    if (typeof self.zcache === "undefined") {
      self.zcache = { 'index.html': '' };
    }

    //  Local cache for static content.
    self.zcache['index.html'] = fs.readFileSync('./index.html');
  };


  /**
   *  Retrieve entry (content) from cache.
   *  @param {string} key  Key identifying content to retrieve from cache.
   */
  self.cache_get = function(key) { return self.zcache[key]; };


  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig){
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
          Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() { self.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() { self.terminator(element); });
    });
  };


  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Create the routing table entries + handlers for the application.
   */
  self.createRoutes = function() {
    self.routes = { };

    self.routes['/asciimo'] = function(req, res) {
      var link = "http://i.imgur.com/kmbjB.png";
      res.send("<html><body><img src='" + link + "'></body></html>");
    };

    //self.routes['/'] = function(req, res) {
    //    res.setHeader('Content-Type', 'text/html');
    //    res.send(self.cache_get('index.html') );
    //};


    self.routes['/hello'] = function(req, res){
      res.send("hello world");
    };

    self.routes['/add'] = function(req, res){
      res.send("hello world");
    };

    self.routes['/yo'] = function(req, res){
      res.send("yo");
    };

    self.routes['/dbtest'] = function(req, res){
      self.db.songs.find({})  .forEach(function(err, doc) {
        if (err){
          res.send(err);
        }
        if (doc) {
          res.send(doc);
        }else{
          res.send("DB WORKS");
        }
      });

    };

    self.routes['/allsongs'] = function(req, res){
      self.db.songs.find(function(err, docs){
        res.send(docs);
      })
    };

    self.routes['/insert'] = function(req, res){
      self.db.songs.insert({"name":"White album 3"}, function(err, result){
        res.send(result);
      })
    };

    self.routes['/delete'] = function(req, res){
      self.db.songs.remove();
      res.send("REMOVED ALL");
    };
  };


  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
    self.createRoutes();
    self.app = app;

    //serve static files
    self.app.use(express.static('public'));

    //  Add handlers for the app (from the routes).
    for (var r in self.routes) {
      self.app.get(r, self.routes[r]);
    }

    app.set('view engine', 'ejs');


    // self.app.use(self.app.router);

    require("./routes")(self.app, self.db, passport);
  };


  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.populateCache();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer();
  };


  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    if(process.env.PORT){//for MODULUS
      console.log("USING MODULUS");
      self.app.listen(process.env.PORT);
    }else{
      self.app.listen(self.port, self.ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
            Date(Date.now() ), self.ipaddress, self.port);
      });
    }
  };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

module.exports = app;

