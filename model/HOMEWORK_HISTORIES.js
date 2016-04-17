var HOMEWORK_HISTORIES = function (db, cb) {
	db.define("HOMEWORK_HISTORIES", {
		CID: { type: "serial", key: true },
		HANDOUT_DATE: { type: "date", time: true, required: true }
	});

	db.models.HOMEWORK_HISTORIES.hasOne("USER", db.models.USERS, { reverse: "HOMEWORK_HISTORIES" });
	db.models.HOMEWORK_HISTORIES.hasOne("HOMEWORK", db.models.HOMEWORKS, { reverse: "HISTORIES" });

	return cb();
};

module.exports = HOMEWORK_HISTORIES;
