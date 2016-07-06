var mongojs = require('mongojs');


module.exports = function (app, db, passport) {
	app.get("/test2", function(req, res){
		res.send("hello");
	});

	app.post("/createSong", isLoggedIn, function(req, res){
		console.log(req.body);

		var song = req.body;

		var error = null;
		if(!song.name || !song.audio || !song.midi) {
			error = "Name, audio, and midi required";
		}
		song.user = req.user.local.email;

		if(song._id){
			song._id = mongojs.ObjectId(song._id);
		}

		if(error != null){
			req.flash('songEntryError', error);
			res.send("/entry");
		}
		else{
			//this is an update
			db.songs.save(song, function(err, response){
				if(err){
					//res.status(400)
					console.log(err);
					req.flash('songEntryError', err);
					res.send("/entry");
				}else{
					//res.send(response);
					if(song._id){
						req.flash('songEntrySuccess', "Updated " + song.name);
						res.send("/entry?id=" + song._id);

					}else{
						req.flash('songEntrySuccess', "Added " + song.name);
						res.send("/entry");
					}
				}
			});
		}
	});




	//?name=
	app.get("/usersongs", isLoggedIn, function(req, res) {

		console.log(req.query);

		console.log(req.user);

		var searchTerm = {
			"user": req.user.local.email
		};

		if(req.query.name) {
			searchTerm.name = 	{$regex:'(?i)' + req.query.name}
		};

		db.songs.find(searchTerm, function(err, response){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.send(response);
			}
		});
	});

	app.get("/publicsongs", function(req, res) {
		//res.header("Access-Control-Allow-Origin", "*");
		//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		db.songs.find({"public": "true"}, function(err, response){
			res.send(response);
		});
	});

	app.get("/usersongs", isLoggedIn, function(req, res) {
		db.songs.find({"user": req.user.local.email}, function(err, response){
			res.send(response);
		});
	});

	app.get("/findSongs/:name", function(req, res){
		console.log(req.params);
		//case insensitive
		db.songs.find({"name":{$regex:'(?i)' + req.params.name}}, function(err, response){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.send(response);
			}
		});
	});

	app.get("/authenticate", isLoggedIn, function(req, res){
		res.send("HEY");
	});

	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.get('/profile',isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists

		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/entry',isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		var msg = req.flash('songEntryError');
		if(req.query.id){
			db.songs.findOne({"_id": mongojs.ObjectId(req.query.id)}, function(err, song){
				console.log(song);
				res.render('songentry.ejs', {
					//message: req.flash('signupMessage')
					user : req.user,
					message: msg,
					success: req.flash('songEntrySuccess'),
					song: song
				});
			});
		}else{
			res.render('songentry.ejs', {
				//message: req.flash('signupMessage')
				user : req.user,
				message: msg,
				success: req.flash('songEntrySuccess'),
				song: {}
			});
		}
	});

	//app.get('/entry/:id',isLoggedIn, function(req, res) {
	//	// render the page and pass in any flash data if it exists
	//	var msg = req.flash('songEntryError');
    //
	//	db.songs.findOne({"_id": db.ObjectId(req.params.id)}, function(err, song){
	//		console.log(song);
	//		res.render('songentry.ejs', {
	//			//message: req.flash('signupMessage')
	//			user : req.user,
	//			message: msg,
	//			success: req.flash('songEntrySuccess'),
	//			song: song
	//		});
	//	});
	//});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	var authenticationOff = true;

	app.get('/', function(req, res) {
		// render the page and pass in any flash data if it exists




		res.render('home.ejs', { message: req.flash('signupMessage') });

		//if(authenticationOff){
		//
        //
		//}



	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/songs', isLoggedIn, function(req, res) {
		db.songs.find({"user":req.user.local.email}, function(err, response){
			res.render('songbrowser.ejs', {
				"songs" : response
			});
		});
	});

	var debug = true;

	function isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on

		//if(debug){
		//	req.user = db.users.find({"local.email":"larryw@mit.edu"});
		//	return next();
		//}
		if (req.isAuthenticated()){
			return next();
		}

		// if they aren't redirect them to the home page
		res.redirect('/');
	}

};