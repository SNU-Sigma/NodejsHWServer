var config = require('config');
var knexConfig = config.get('knexConfig');
var knex = require('knex')(knexConfig);

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

module.exports = bookshelf;
