var http = require("http");
var url = require("url");
var fs = require("fs");
var formidable = require("formidable");

const server = http.createServer(callbackOnRequestResponseHandling);
server.listen(8080, () =>
  console.log("Server je starta i oslušluje na portu 8080")
);

function callbackOnRequestResponseHandling(req, resp) {
  const parsedUrl = url.parse(req.url, true);

  const pathNameOfUrl = parsedUrl.pathname;
  if (pathNameOfUrl.includes("fileupload")) {
    //Treba da izađe na kraj sa poslanim fajlom iz one forme
     var form = new formidable.IncomingForm();
     form.parse(req, function(err, fields, files){
        resp.write("File uploaded");
        const orgnialniNazivFajla = files.fajlZaPoslati.originalFilename;
        const oldPath = files.fajlZaPoslati.filepath;
        const newPathOfFile = `C:/Users/Grupa 2/Desktop/Emir_Puska/JavaScriptApplicationDevelopment/backend/two/files/` + orgnialniNazivFajla;
        fs.rename(oldPath, newPathOfFile, function(err){
            if(err) throw err;
            resp.write("File is uploaded and moved via server");
            resp.end();
        });
        resp.end();
     });
  } else {
    //login.html   ./login.html
    const fileName = "." + pathNameOfUrl;
    fs.readFile(fileName, function (err, data) {
      if (err) {
        resp.writeHead(404, { "Content-Type": "text/html" });
        return resp.end("404 Not Found");
      }
      resp.writeHead(200, { "Content-Type": "text/html" });
      resp.write(data);
      return resp.end();
    });
  }
}
