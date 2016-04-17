var db = require('./db');

var UsersScheme = function (t) {
	t.increments('CID').primary();
	t.string('USER_ID').unique();
	t.string('USER_PASSWORD');
};

var UserHistoriesScheme = function (t) {
	t.increments('CID').primary();
	t.datetime('ACCESS_TIME');
};

db.knex.schema
	.createTable('USERS', UsersScheme)
	.createTable('USER_HISTORIES', UserHistoriesScheme);

