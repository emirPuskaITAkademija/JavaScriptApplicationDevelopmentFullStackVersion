const express = require("express");
const { fetchFilms, fetchFilmPage } = require("./requestHandler");

const router = express.Router();

//http://localhost:8080/api/films
router.get("/api/films", fetchFilms);
///http://localhost:8080/api/film?page=2&pageSize=10
router.get("/api/film", fetchFilmPage);

module.exports = router;
