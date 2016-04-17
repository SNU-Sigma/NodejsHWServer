var USERS = function (db, cb) {
	db.define("USERS", {
		CID: { type: "serial", key: true },
		USER_ID: { type: "text", unique: true, required: true },
		USER_PASSWORD: { type: "text", required: true },
		REGISTER_DATE: { type: "date", time: true, required: true }
	});

	return cb();
};

module.exports = USERS;
