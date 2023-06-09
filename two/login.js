var http = require("http");
var fs = require("fs");
var url = require("url");

const server = http.createServer(onRequestHandle);
server.listen(8080, () =>
  console.log("Server počeo osluškivati htt zahtjeve...")
);

function onRequestHandle(req, resp) {
  const urlRequest = req.url;

  if (urlRequest.includes("kreiraj")) {
    fs.writeFile("fajl.txt", "Novi sadržaj", function (err) {
      if (err) {
        throw err;
      }
      console.log("Fajl je snimljen...");
    });
  } else if (urlRequest.includes("izbrisi")) {
    fs.unlink("fajl.txt", function (err) {
      if (err) {
        throw err;
      }
      console.log("Fajl je izbrisan...");
    });
  } else if (urlRequest.includes("izmijeni_ime")) {
    fs.rename("sadrzaj.txt", "content.txt", function (err) {
      if (err) {
        throw err;
      }
      console.log("Preimenovan je fajl iz sadrzaj.txt u content.txt.");
    });
  } else {
    fs.readFile("login.html", function (error, data) {
      resp.writeHead(200, { "Content-Type": "text/html" });
      resp.write(data);
      return resp.end();
    });
  }
}
