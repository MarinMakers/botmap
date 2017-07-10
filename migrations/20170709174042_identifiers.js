
exports.up = function(knex, Promise) {
  knex("botmap").createTable(function(table) {
  	table.incrementer("id");
  	table.string("user_id");

  })
};

exports.down = function(knex, Promise) {
  knex().dropTable("identifiers");
};
