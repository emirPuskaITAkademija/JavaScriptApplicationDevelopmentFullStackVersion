var http = require("http");
var dv = require('./custom_module');

http
  .createServer(function (request, response) {
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write("Trenutno vrijeme je definisano mojim modulom: " + dv.dobaviVrijemeDatum());
    response.end();
  })
  .listen(8080, () => console.log("startao je na portu 8080"));
