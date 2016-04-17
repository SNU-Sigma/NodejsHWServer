var models = function (db, cb) {
	db.load("./USERS", "./HOMEWORKS", "./HOMEWORK_PROBLEMS", "./HOMEWORK_HISTORIES", "./HOMEWORK_FILES", function (err) {
		if (err) {
			console.log(err);
			return cb(err);
		}

		return cb();
	});
};

module.exports = models;
