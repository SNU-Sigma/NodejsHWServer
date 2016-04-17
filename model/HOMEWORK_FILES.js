var HOMEWORK_FILES = function (db, cb) {
	db.define("HOMEWORK_FILES", {
		CID: { type: "serial", key: true },
		FILE_PATH: { type: "text" },
		HANDOUT_DATE: { type: "date", time: true, required: true }
	});

	db.models.HOMEWORK_FILES.hasOne("HISTORY", db.models.HOMEWORK_HISTORIES, { reverse: "FILES" });
	db.models.HOMEWORK_FILES.hasOne("PROBLEM", db.models.HOMEWORK_PROBLEMS, { reverse: "FILES" });
	
	return cb();
};

module.exports = HOMEWORK_FILES;
