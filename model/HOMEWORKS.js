var HOMEWORKS = function (db, cb) {
	db.define("HOMEWORKS", {
		CID: { type: "serial", key: true },
		NUMBER: { type: "text", unique: true, required: true },
		POST_DATE: { type: "date", time: true, required: true },
		DUE_DATE: { type: "date", time: true, required: true }
	});

	return cb();
};

module.exports = HOMEWORKS;
