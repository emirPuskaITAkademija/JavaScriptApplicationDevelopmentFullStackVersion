const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const mysqlParamObject = {
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "sakila",
};
const pool = mysql.createPool(mysqlParamObject);

//frontend -> request-> BACKEND response -> mysql --> dovukli podatke i ubacili u response

//express app
const app = express();
app.use(cors());
const port = 8081;

//http://localhost:8081/api/film?page=3&pageSize=5 -> query parametri URL
app.get("/api/film", countFilmRows);
function countFilmRows(request, response) {
  const sqlCountQuery = "SELECT count(film_id) AS totalRowNumber FROM film";
  const promise = pool.promise().query(sqlCountQuery);
  promise
    .then(([results, fields]) => {
      const firstRow = results[0];
      const totalRowNumber = firstRow.totalRowNumber; //1004
      callbackOnFilmRequest(request, response, totalRowNumber);
    })
    .catch((error) => {
      response.status(500).json({ message: `Count erro ${error}` });
    });
}

function callbackOnFilmRequest(request, response, totalRowNumber) {
  //Extract query params
  const page = parseInt(request.query.page);
  const pageSize = parseInt(request.query.pageSize);
  //Izračunati offset -> preskočiti redova kad prikazujem 1 ili 2 ili 3
  const offset = (page - 1) * pageSize;
  //SELECT * FROM film 10,5
  const sqlQuery = `SELECT * FROM film LIMIT ${offset},${pageSize}`;
  const promise = pool.promise().query(sqlQuery);
  promise
    .then(([rows, fields]) => {
      const pageCount = Math.ceil(totalRowNumber / pageSize);
      const responseObject = {
        pageCount: pageCount,
        items: rows,
      };
      response.json(responseObject);
    })
    .catch((error) => {
      response.status(500).error({ message: error });
    });
}

app.listen(port, () => console.log(`App starta na portu ${port}`));
