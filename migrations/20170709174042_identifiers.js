
exports.up = function(knex, Promise) {
  return knex.schema.createTable("identifiers", function(table) {
  	table.increments("id").primary();
  	table.string("user_id");

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("identifiers");
};
