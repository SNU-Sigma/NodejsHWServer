var express = require('express');
var router = express.Router();

var path = require('path');
var fse = require('fs-extra');
var passport = require('passport');

var config = require('config');
var problemSavepath = config.get('filepath');
var secret = config.get('cryptoSecret');

var async = require('async');

var crypto = require('crypto');

function mainpageCallback(req, res, next) {
	req.models.HOMEWORKS.find(function (err, HOMEWORKS) {
		if (err) console.log(err);

		var webdata = {
			title: 'Node.js @ Sigma',
			user: req.user,
			current: new Date(),
			HWS: HOMEWORKS
		};
		res.render('index', webdata);
	});
}
router.get('/',
		   mainpageCallback);

function loginCallback(req, res, next) {
	console.log("here");
	res.redirect('/');
}
router.post('/login',
			passport.authenticate('local'),
			loginCallback);
function logoutCallback(req, res, next) {
	req.logout();
	res.redirect('/');
}
router.post('/logout', logoutCallback);
function passwordCallback(req, res, next) {
	if (req.user) {
		var webdata = {
			title: 'Node.js @ Sigma',
			user: req.user
		};

		res.render('password', webdata);
	}
}
router.get('/changePassword', passwordCallback);
function changeCallback(req, res, next) {
	var newpassword = req.body.newpassword;
	var hash = crypto.createHash('sha256');
	hash.update(newpassword);
	newpassword = hash.digest('hex');

	req.models.USERS.get(req.user.CID, function (err, user) {
		if(err) console.log(err);

		user.USER_PASSWORD = newpassword;
		console.log(newpassword);
		user.save(function (err) {
			if(err) console.log(err);

			res.redirect('/');
		});
	});
}
router.post('/changePassword',
			passport.authenticate('local', {
				failureRedirect: '/changePassword'
			}),
			changeCallback);

function hwpageCallback(req, res, next) {
	if (req.user) {
		req.models.HOMEWORKS.find({ NUMBER: req.params.num }, function (err, HOMEWORKS) {
			var webdata = {
				title: 'Node.js @ Sigma'
			};

			if (err) console.log(err);

			if (HOMEWORKS.length > 0) {
				webdata.HOMEWORK = HOMEWORKS[0];
				console.log(HOMEWORKS[0]);
				HOMEWORKS[0].getPROBLEMS(function (err, PROBLEMS) {
					if (err) console.log(err);
					
					webdata.HOMEWORK_PROBLEMS = PROBLEMS;
					
					res.render('hw_submit', webdata);
				});
			}
		});
	} else {
		res.status(403).send();
	}
}
router.get('/HW_Submit/:num',
		   hwpageCallback);

function submitCallback(req, res, next) {
	var now = new Date();
	console.log(req.files);
	if (req.user) {
		var problemFiles = [];
		for (var problemID in req.files) {
			if (req.files[problemID].originalFilename) {
				problemFiles.push({
					problemID: problemID,
					problemFilename: req.files[problemID].originalFilename,
					problemFilepath: req.files[problemID].path
				});
			}
		}
		console.log("abab");
		req.models.HOMEWORKS.find({ NUMBER: req.params.num }, function (err, HOMEWORKS) {
			var files = [];
			if (err) console.log(err);

			console.log("cccc");
			if (HOMEWORKS.length > 0) {
				console.log("bbbb");
				async.all(problemFiles, function (problemFile, cb) {
					var tempPath = problemFile.problemFilepath;
					var realPath = path.join(problemSavepath, new Date().valueOf() + problemFile.problemFilename);
			 		fse.move(tempPath, realPath, { clobber: true }, function (err) {
						var file = {
							FILE_PATH: realPath,
							HANDOUT_DATE: now
						};
						
						if (err) console.log(err);
						
						req.models.HOMEWORK_FILES.create(file, function (err, file) {
							if (err) console.log(err);

							files.push(file);
							
							req.models.HOMEWORK_PROBLEMS.find({ CID: problemFile.problemID }).first(function (err, problem) {
								if (err) console.log(err);
								console.log(file);
								
								file.setPROBLEM(problem, function (err) {
									if (err) console.log(err);

									cb(err, !err);
								});
							});
						});
					});
				}, function (err, result) {
					var history = {
						HANDOUT_DATE: now
					};
			
					if (err) console.log(err);
					
					req.models.HOMEWORK_HISTORIES.create(history, function (err, history) {
						if (err) console.log(err);

						history.setUSER(req.user, function (err) {
							if (err) console.log(err);
							
							history.setHOMEWORK(HOMEWORKS[0], function (err) {
								if (err) console.log(err);

								history.setFILES(files, function (err) {
									if (err) console.log(err);

									res.redirect('/');
								});
							});
						});
					});
				});
			} else {
				res.redirect('/');
			}
		});
	} else {
		res.status(403).send();
	}
}
router.post('/HW_Submit/:num',
			submitCallback);

module.exports = router;
