const { connectToDatabase } = require("./database");
//arrow function
const fetchFilms = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const sqlQuery = "SELECT * FROM film";
    const [films] = await connection.execute(sqlQuery);
    res.json(films);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error on films fetching. Reason ${error}` });
  }
};

// const films = [];
//const filmPage = {   totalPageNumber: 101, items: []}
const fetchFilmPage = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    // Iz request page i pageSize
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    //SQL query - films on specific page
    const offset = (page - 1) * pageSize;
    const sqlQueryFilmOnPage = `SELECT sql_calc_found_rows * FROM film LIMIT ${offset},${pageSize}`;
    const [films] = await connection.execute(sqlQueryFilmOnPage);
    //SQL query - count ukupan broj filmova u tabeli
    const sqlCountQuery = "SELECT FOUND_ROWS() AS count";
    const [rows] = await connection.execute(sqlCountQuery);
    const totalFilmNumber = rows[0].count;
    const totalPageNumber = Math.ceil(totalFilmNumber/pageSize);
    res.json(
      {
        totalPageNumber: totalPageNumber, 
        items: films
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error on film page fetching. Reason ${error}` });
  }
};

module.exports = { fetchFilms , fetchFilmPage};
