const express = require("express");
const mysql = require("mysql2");

const app = express();

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
        message: `Greška ${error}`
      });
    });
}

//Kreiranje novog usera HTTP POST http://localhost:8081/users
app.post('/users', callbackOnCreateUser);

function callbackOnCreateUser(request, response){

}

app.listen(8081, () => {
  console.log("Server Backend API je startao na portu 8081");
});
