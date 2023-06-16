const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

//Kreiramo MYSQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "frontend",
});

//Kreiramo express application
const app = express();
app.use(cors());
const port = 8080;
//http://localhost:8080/api/articles
app.get("/api/articles", callbackOnArticleLoad);
function callbackOnArticleLoad(request, response) {
  //Extract query params
  const page = parseInt(request.query.page);
  const pageSize = parseInt(request.query.pageSize);
  //2 -> offset ili koliko redova trebam preskočiti
  //page = 1 -> 0 1-10
  //page = 2 -> 10 11-20
  //page = 3 -> 20 21-30
  const offset = (page - 1) * pageSize;

  //Konstruisati query
  let query;
  if (page) {
    query = `SELECT * FROM articles LIMIT ${offset},${pageSize}`;
  } else {
    query = "SELECT * FROM articles";
  }

  pool.query(query, (error, result) => {
    if (error) {
      response.status(500).json({ message: `Reason ${error}` });
    } else {
      response.json(result);
    }
  });
}

app.listen(port, () => console.log(`Aplikacija starta na portu ${port}`));
