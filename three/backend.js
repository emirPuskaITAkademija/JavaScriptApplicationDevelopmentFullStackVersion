const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

//request/response
const app = express();
//Linijom ispod smo rekli da request body prebaci bodyParser u json format
app.use(bodyParser.json());


//SQL upiti na bazu
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "frontend",
});

//connection poveži se sa bazom podatak
connection.connect(callbackOnDBConnect);

function callbackOnDBConnect(error) {
  if (error) {
    console.log(`Problem prilikom povezivanja na bazu ${error}`);
    return;
  }
  console.log("Uspješno sam se povezao s bazom...");
}

//app izađi na kraj sa HTTP GET zahtjevom koji stigne na adresu http://localhost:8080/users
app.get("/users", callbackOnGet);

function callbackOnGet(req, resp) {
  //SQL upit po pravilima SQL
  const sqlSelect = "SELECT * FROM users";
  //app i connection -> 
  connection.query(sqlSelect, callbackOnSelectStatement);
  function callbackOnSelectStatement(error, result) {
    if (error) {
      resp.status(500).json({
        error: `Došlo je do greške prilikom interakcije s bazom ${error}`,
      });
      return;
    }
    resp.json(result);
  }
}

//get samo jednog users reda   http://localhost:8080/users/id
app.get("/users/:id", callbackOnGetSingleUser);

function callbackOnGetSingleUser(req, resp) {
  const userId = req.params.id;
  console.log(`User ID ${userId}`);
  const sqlQuery = "SELECT * FROM users WHERE id=?";
  connection.query(sqlQuery, [userId], callbackSelectSingleUser);
  function callbackSelectSingleUser(error, result) {
    if (error) {
      resp.status(500).json({
        error: `Došlo je do greške prilikom interakcije s bazom ${error}`,
      });
      return;
    }
    resp.json(result[0]);
  }
}

//Kreirati novog koristnika kroz frontend request
app.post("/users", callbackOnPost);

function callbackOnPost(req, resp) {
  console.log(req.body);
  const { name, surname, username, password } = req.body;
  const sqlInsert =
    "INSERT INTO users (name,surname,username,password) VALUES (?,?,?,?)";
  connection.query(
    sqlInsert,
    [name, surname, username, password],
    callbackOnInsert
  );
  function callbackOnInsert(error, result) {
    if (error) {
      resp.status(500).json({
        error: `Došlo je do greške prilikom interakcije s bazom ${error}`,
      });
      return;
    }
    resp.status(201).json({
      message: "Korisnik je kreiran",
    });
  }
}

//AŽURIRANJE postojećeg usera
app.put("/users/:id", callbackOnPut);

function callbackOnPut(req, resp) {
  const userId = req.params.id;
  const { name, surname, username, password } = req.body;
  const sqlUpdate =
    "UPDATE users SET name=?,surname=?,username=?,password=? WHERE id=?";
  connection.query(
    sqlUpdate,
    [name, surname, username, password, userId],
    callbackOnUpdate
  );

  function callbackOnUpdate(error, result) {
    if (error) {
      resp.status(500).json({
        error: `Došlo je do greške prilikom interakcije s bazom ${error}`,
      });
      return;
    }
    resp.json({
      message: "Korisnik uspješno ažuriran",
    });
  }
}

//Brisanje korisnika
app.delete("/users/:id", callbackOnDelete);

function callbackOnDelete(req, resp) {
  const userId = req.params.id;
  const sqlDeleteQuery = "DELETE FROM users WHERE id=?";
  connection.query(sqlDeleteQuery, [userId], callbackOnSqlDelete);
  function callbackOnSqlDelete(error, result) {
    if (error) {
      resp.status(500).json({
        error: `Došlo je do greške prilikom interakcije s bazom ${error}`,
      });
      return;
    }
    resp.json({
        message: `Uspješno obrisan korisnik čiji je id ${userId}`
    });
  }
}

const port = 8080;
app.listen(port, () => {
  console.log(`Server osluškuje na portu ${port}`);
});
