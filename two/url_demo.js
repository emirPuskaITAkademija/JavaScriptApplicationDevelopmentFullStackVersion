var url = require("url");

const urlAddress = "http://localhost:8080/login?name=Arnaldo&surname=Larise";

//Parse kompletan URL address
var parsiranaAdresa = url.parse(urlAddress, true);
//host
console.log(parsiranaAdresa.host);
//pathname
console.log(parsiranaAdresa.pathname);
// search param
console.log(parsiranaAdresa.search);

//query param
const queryParams = parsiranaAdresa.query;
console.log(queryParams.surname);