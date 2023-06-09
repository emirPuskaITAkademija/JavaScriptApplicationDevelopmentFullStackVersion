//mysql mysql2
const mysql = require("mysql2");

const jsConnectionObjectParam = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "frontend",
};
const connection = mysql.createConnection(jsConnectionObjectParam);
//SQL upit : SELECT * FROM users;
const sqlQuery = "SELECTs * FROM users";
//daj mi obećanje da ćeš dati result ili error nakon što izvršiš ovaj sqlQuery
const promise = connection.promise().query(sqlQuery);
promise
      .then(obradiResult)
      .catch(obradiError)
      .finally(()=>connection.end());

function obradiResult([rows, fields]){
    //Obradit result
    console.log(rows);
}

function obradiError(error){
    //Obradi error
    console.log(error);
}



/*connection.query(sqlQuery, callbackOnQueryResult);

function callbackOnQueryResult(error, result) {
  if (error) {
    console.log(`Došlo je do greške prilikom interakcije s bazom ${error}`);
    return;
  }
  console.log(result);
}*/
