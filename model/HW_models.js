var db = require('./db');

var HomeworksScheme = function (t) {
	t.increments('CID').primary();
	t.integer('NUM').unique();
	t.datetime('POSTED_DATE');
	t.datetime('DUE_DATE');
};

var HomeworkProblemsScheme = function (t) {
	t.increments('CID').primary();
	t.string('PROBLEM');
	t.string('DESCRIPTION');
	t.string('FILE_TYPE');
};

var Homeworks = db.Model.extend({
	tableName: 'Homeworks'
});
