const MY_SQL = require("mysql");

const POOL = MY_SQL.createPool({}); // pool connection

POOL.on("enqueue", console.log);
POOL.on("release", console.log);

module.exports = POOL;