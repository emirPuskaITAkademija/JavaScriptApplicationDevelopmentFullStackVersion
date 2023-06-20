const express = require("express");
const router = require("./router");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(router);

const port = 8080;
//http://localhost:8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
