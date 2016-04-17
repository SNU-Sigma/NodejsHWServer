var HOMEWORK_PROBLEMS = function (db, cb) {
	db.define("HOMEWORK_PROBLEMS", {
		CID: { type: "serial", key: true },
		PROBLEM: { type: "text", unique: true, required: true },
		DESCRIPTION: { type: "text", required: true },
		FILE_FORMAT: { type: "text" }
	});

	db.models.HOMEWORK_PROBLEMS.hasOne("HOMEWORK", db.models.HOMEWORKS, { reverse: "PROBLEMS" });

	return cb();
};

module.exports = HOMEWORK_PROBLEMS;
