
exports.up = function(knex, Promise) {
  return knex.schema.createTable("identifiers", function(table) {
      table.increments("id");
      table.string("user_id");
      table.integer("loc_id");
      //table.foreign("loc_id").references("id").inTable("locations");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("identifiers")
  //.dropTable("locations");
};
