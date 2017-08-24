
exports.up = function(knex, Promise) {
	return knex.schema.createTable("ip_ranges", function(table) {
		table.increments("id").primary();
		table.string("network");
		table.integer("start_ip_int");
		table.integer("end_ip_int");
		table.string("geoname_id");
		table.string("registered_country_geoname_id");
		table.string("represented_country_geoname_id");
		table.boolean("is_anonymous_proxy");
		table.boolean("is_satellite_provider");
		table.string("postal_code");
		table.float("latitude");
		table.float("longitude");
		table.integer("accuracy_radius");
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable("ip_ranges");
};
