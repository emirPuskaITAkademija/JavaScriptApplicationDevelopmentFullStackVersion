const express = require("express"); //npm install express
const cors = require("cors"); //npm install cors
const mysql = require("mysql2"); //npm install mysql2
const bodyParser = require("body-parser"); // npm install body-parser
const bcrypt = require("bcrypt"); // npm install bcrypt

//hajdemo startati backend na adresi http://localhost:8080
// i dodati servis /api/register
const app = express();
//Dozvoli CORS za sve rute
app.use(cors());
//Ona koristi i body parser -> json
app.use(bodyParser.json());

//MySQL konfiguracija
const configObject = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "frontend",
};
const connection = mysql.createConnection(configObject);
connection.connect((error) => {
  if (error) console.log(`Problem prilikom povezivanja na bazu. ${error}`);
  console.log("Povezani smo na bazu preko porta 3306");
});

//register endpoint/REST servis/API
app.post("/api/register", callbackOnRegister);
function callbackOnRegister(request, response) {
  const { nameInput, surnameInput, usernameInput, emailInput, passwordInput } =
    request.body;
  //Proces hashiranja passwordInput
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (error, salt) => {
    bcrypt.hash(passwordInput, salt, (error, hashedPassword) => {
      if (error) {
        response.status(500).json({ message: `Reason ${error}` });
      }
      registerUser(
        nameInput,
        surnameInput,
        usernameInput,
        emailInput,
        hashedPassword,
        response
      );
    });
  });
}

function registerUser(
  nameInput,
  surnameInput,
  usernameInput,
  emailInput,
  hashedPassword,
  response
) {
  //username , email
  const sqlInsertRegister =
    "INSERT INTO users (name,surname,username,password,email) VALUES (?,?,?,?,?)";
  const promise = connection
    .promise()
    .query(sqlInsertRegister, [
      nameInput,
      surnameInput,
      usernameInput,
      hashedPassword,
      emailInput,
    ]);
  promise
    .then(() => {
      response.status(201).json({ message: "Uspješno registrovan korisnik" });
    })
    .catch((error) => {
      const jsonObjectErrorResponse = {
        message: `Reason ${error}`,
      };
      response.status(500).json(jsonObjectErrorResponse);
    });
}

//LOGIN /api/login
app.post("/api/login", callbackOnLogin);
function callbackOnLogin(request, response) {
  const { usernameInput, passwordInput } = request.body;
  //adi123   ->
  //const sqlStatement = "SELECT * FROM users WHERE username=? AND password=?";
  const sqlStatement = "SELECT password FROM users WHERE username=?"; // tačno jedan zapis
  const promise = connection.promise().query(sqlStatement, [usernameInput]);
  promise
    .then(async ([rows, fields]) => {
      if (rows.length === 0) {
        response.status(401).json({
          message: "Neispravna kombinacija lozinke i korisničko naloga",
        });
      }
      if (rows.length > 1) {
        response
          .status(401)
          .json({ message: "Korisnički nalog kompromitovan" });
      }
      const storedPassword = rows[0].password;
      console.log(`Stored password ${storedPassword}`);
      const result = await bcrypt.compare(passwordInput, storedPassword);
      if (result) {
        response.status(200).json({ message: "Uspješno logovan korisnik" });
      } else {
        response.status(401).json({
          message: "Neispravna kombinacija lozinke i korisničko naloga",
        });
      }
    })
    .catch((error) => {
      response.status(500).json({
        message: `Greška ${error}`,
      });
    });
}

const port = 8080;
app.listen(port, () =>
  console.log(`Backend Aplikacija startala na portu ${port}`)
);
