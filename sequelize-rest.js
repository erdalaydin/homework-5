const Sequelize = require("sequelize");
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:erdal@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
const Movie = db.define(
  "movie",
  {
    title: {
      type: Sequelize.STRING,
      field: "movie_title"
    },
    yearOfRelease: {
      type: Sequelize.INTEGER,
      field: "movie_year_of_release"
    },
    synopsis: {
      type: Sequelize.STRING,
      field: "movie_synopsis"
    }
  },
  { tableName: "movies" }
);

db.sync()
  .then(console.log("Tables created succesfully"))
  .catch(err => {
    console.error("Unable to create tables, shutting down...", err);
    process.exit(1);
  });

Movie.create({
  title: "The Godfather",
  yearOfRelease: 1975,
  synopsis:
    "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
});

Movie.create({
  title: "The Shawshank Redemption ",
  yearOfRelease: 1994,
  synopsis:
    "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
});

Movie.create({
  title: " Schindler's List",
  yearOfRelease: 1993,
  synopsis:
    "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis."
});

app.post("/movies", (req, res, next) => {
  Movie.create(req.body)
    .then(recentCreated => {
      res.json(recentCreated);
    })
    .catch(next);
});

app.get("/movies", (req, res, next) => {
  Movie.findAll(req.body)
    .then(movies => res.send(movies))
    .catch(next);
});

app.get("/movies/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => res.send(movie))
    .catch(next);
});

app.put("/movies/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => movie.update(req.body))
    .catch(next);
});

app.delete("/movies/:id", (req, res, next) => {
  Movie.destroy({ where: { id: req.params.id } })
    .then(deletedmovie => res.send(req.body))
    .catch(next);
});

app.listen(`${port}`, () => console.log(`Server already start at ${port}`));
