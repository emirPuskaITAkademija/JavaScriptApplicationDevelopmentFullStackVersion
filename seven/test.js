const mysql = require("mysql2");

const mysqlParamObject = {
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "sakila",
};
const pool = mysql.createPool(mysqlParamObject);

function countFilmRows() {
  const sqlCountQuery = "SELECT count(film_id) AS pageCount FROM film";
  let result = 0;
  const promise = pool.promise().query(sqlCountQuery);
  const results = promise;
  result = results[0].pageCount;
  return result;
}

console.log(countFilmRows);
