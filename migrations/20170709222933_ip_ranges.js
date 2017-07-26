
exports.up = function(knex, Promise) {
  return knex.schema.createTable("ip_ranges", function(table) {
      table.integer("startIpNum");
      table.integer("endIpNum");
      table.integer("loc_id");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("ip_ranges");
};
