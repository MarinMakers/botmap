exports.up = function(knex, Promise) {
	return knex.schema.createTable("locations", function(table) {
		//table.increments("id");
		table.string("geoname_id").index();
		table.string("locale_code");
		table.string("continent_code");
		table.string("continent_name");
		table.string("country_iso_code");
		table.string("country_name");
	})
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable("locations");
};
