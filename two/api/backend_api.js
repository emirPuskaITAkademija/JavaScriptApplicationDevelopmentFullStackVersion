const express = require("express");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "hotels",
});

db.connect((err) => {
  if (err) {
    console.log("Greška prilikom povezivanja s bazom: ", err);
    return;
  }
  console.log("Uspješno sam se povezao na bazu podataka 'hotels'...");
});

//REST servis pomoću express ili app koja će imati REST api
const app = express();
//http get    http://localhost:8080/api/users
app.get("/api/users", (req, resp) => {
  const sqlUpit = "SELECT * FROM user";
  db.query(sqlUpit, (err, result) => {
    resp.json(result);
  });
});

//http post http://localhost:8080/api/users
app.post("/api/users", (req, resp) => {

    const {username, password, name, surname, id_privilege} =req.body;

  const sqlInsert =
    "INSERT INTO user(username,password,name, surname, id_privilege) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sqlInsert,
    [username, password, name, surname, id_privilege],
    (err, result) => {
      resp.status(201).send("User kreiran");
    }
  );
});

app.listen(8080, () => console.log("Startana je aplikacija na portu 8080..."));
