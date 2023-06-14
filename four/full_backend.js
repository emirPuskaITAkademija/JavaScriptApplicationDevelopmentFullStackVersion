const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
//CORS je biblioteka koja automatski postavlja CORS
//const cors = require('cors');

const app = express();
app.use(bodyParser.json());
//app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "frontend",
});

//app <-> connection  http://localhost:8080/users HTTP GET request
app.get("/users", callBackOnGetUsers);

function callBackOnGetUsers(request, response) {
  //Primjer SQL query preko promise
  const sqlQuery = "SELECT * FROM users";
  const promise = connection.promise().query(sqlQuery);
  promise
    .then(([rows, fields]) => {
      response.json(rows);
    })
    .catch((error) => {
      response.status(500).json({
        message: `Greška ${error}`,
      });
    });
}

//http://localhost:8080/users/2 HTTP GET request
app.get("/users/:id", callbackOnGetSingleUser);

function callbackOnGetSingleUser(request, response) {
  const userId = request.params.id;
  const sqlQuery = "SELECT * FROM users WHERE id=?";
  const promise = connection.promise().query(sqlQuery, [userId]);
  promise
    .then(([rows, fields]) => {
      if (rows.length == 0) {
        response.status(404).json({
          error: "User not found",
        });
      } else {
        response.json(rows[0]);
      }
    })
    .catch((error) => {
      response.status(500).json({
        message: `Greška ${error}`,
      });
    });
}

//Kreiranje novog usera HTTP POST http://localhost:8081/users
app.post("/users", callbackOnCreateUser);

function callbackOnCreateUser(request, response) {
  const { name, surname, username, password } = request.body;
  const sqlInsert =
    "INSERT INTO users (name,surname,username,password) VALUES (?,?,?,?)";
  const promise = connection
    .promise()
    .query(sqlInsert, [name, surname, username, password]);

  promise
    .then(() => {
      response.status(201).json({ message: "User is created" });
    })
    .catch((error) => {
      response.status(500).json({ message: `Reason ${error}` });
    });
}

//HTTP PUT http://localhost:8081/users/6
app.put("/users/:id", callbackOnUpdateUser);
function callbackOnUpdateUser(request, response) {
  const userId = request.params.id;
  /**
   * ZADAĆA: Doraditi UPDATE metodu...
   * Da li postoji user sa specifičnim ID
   *  then()
   *  catch()
   */
  const { name, surname, username, password } = request.body;
  const sqlUpdate =
    "UPDATE users SET name=?,surname=?,username=?,password=? WHERE id=?";
  const promise = connection
    .promise()
    .query(sqlUpdate, [name, surname, username, password, userId]);

  promise
    .then(() => {
      response.json({ message: "User updated" });
    })
    .catch((error) => {
      response.status(500).json(`Reason ${error}`);
    });
}

//HTTP DELETE request http://localhost:8081/users/:id
app.delete("/users/:id", callbackOnDeleteUser);
function callbackOnDeleteUser(request, response) {
  const userId = request.params.id;
  const sqlDelete = "DELETE FROM users WHERE id=?";
  const promise = connection.promise().query(sqlDelete, [userId]);
  promise
    .then(() => {
      response.json({ message: "User deleted" });
    })
    .catch((error) => {
      response.status(500).json({ message: `Reason ${error}` });
    });
}

/**
 * Login REST method
 */
app.post("/register", callbackOnRegisterRequest);
function callbackOnRegisterRequest(request, response) {
  const { username, password, name, surname } = request.body;
  const sqlInsert =
    "INSERT INTO users (username, password, name, surname) VALUES (?, ?, ?, ?)";
  const promise = connection
    .promise()
    .query(sqlInsert, [username, password, name, surname]);
  promise
    .then(() => {
      response.status(201).json({ message: "Registration completed" });
    })
    .catch((error) => {
      response.status(500).json({ message: `Reason ${error}` });
    });
}

app.listen(8081, () => {
  console.log("Server Backend API je startao na portu 8081");
});
