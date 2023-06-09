//Iskoristili gotov ugrađen modul  Builtin modules
var http = require("http");
var url = require("url");
var trenutniDatum = require("./nas_modul");
var fs = require("fs");

const port = 8080;
var server = http.createServer(onRequestHandle);
server.listen(port, onStatusServerExecuteMessage);

function onRequestHandle(req, resp) {
  //query string url
  const urlPart = req.url;
  const queryParams = url.parse(urlPart, true).query;
  const fullName = queryParams.username + "   " + queryParams.password;
  resp.writeHead(200, {
    "Content-Type": "text/html",
  });
  const result = trenutniDatum.vaseVrijeme();
  resp.write("Vozdra raja sa JS<br>");
  resp.write(`Trenutno vrijeme ${result}<br>`);
  resp.write(`Welcome <b>${fullName}</b>`);
  resp.end();
}

function onStatusServerExecuteMessage() {
  console.log(`Server je startan na ${port}`);
}
