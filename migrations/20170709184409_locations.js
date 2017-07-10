
exports.up = function(knex, Promise) {
  return knex.schema.createTable("locations", function(table) {
      table.increments("id");
      table.string("countryCode");
      table.string("region");
      table.string("city");
      table.string("postalCode");
      table.decimal("latitude");
      table.decimal("longitude");
      table.string("metroCode");
      table.string("areaCode");
      table.string("ip");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("locations");
};
