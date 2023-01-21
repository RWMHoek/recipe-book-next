const { Pool } = require('pg');

const pool = new Pool({
    database: "recipe_book",
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "postgres"
});

module.exports = {
    query: (text, params) => pool.query(text, params)
}