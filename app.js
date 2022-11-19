const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

intializeDBandServer();

const fromSnakeToCamel = (dbObj) => {
  return {
    movieId: dbObj.movie_id,
    directorId: dbObj.director_id,
    movieName: dbObj.movie_name,
    leadActor: dbObj.lead_actor,
    directorName: dbObj.director_name,
  };
};

//GET 1

app.get("/movies/", async (request, response) => {
  const allMoviesQuery = `SELECT movie_name
  FROM movie 
  ORDER BY movie_id;`;
  const dbResponse = await db.all(allMoviesQuery);
  response.send(dbResponse.map((each) => fromSnakeToCamel(each)));
});

// GET 2
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieQuery = `SELECT * 
    FROM movie 
    WHERE movie_id = ${movieId};`;
  const dbResponse = await db.get(movieQuery);
  response.send(fromSnakeToCamel(dbResponse));
});

//GET API 6
app.get("/directors/", async (request, response) => {
  const directorQuery = `SELECT * 
    FROM director 
    ORDER BY director_id;`;
  const dbResponse = await db.all(directorQuery);
  response.send(dbResponse.map((each) => fromSnakeToCamel(each)));
});

//GET API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const directorQuery = `SELECT movie_name 
  FROM movie 
  WHERE director_id = ${directorId};`;
  const dbResponse = await db.all(directorQuery);
  response.send(dbResponse.map((each) => fromSnakeToCamel(each)));
});

// POST API 1

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const Query = `INSERT INTO movie 
    (director_id, movie_name, lead_actor) 
    values (${directorId}, '${movieName}', '${leadActor}');`;
  await db.run(Query);
  response.send("Movie Successfully Added");
});

//PUT API 1
app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const Query = `INSERT INTO movie
    (director_id, movie_name, lead_actor) 
    values (${directorId}, '${movieName}', '${leadActor}');`;
  await db.run(Query);
  response.send("Movie Details Updated");
});

// DELETE API 1
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const Query = `DELETE FROM 
    movie WHERE movie_id = ${movieId};`;
  await db.run(Query);
  response.send("Movie Removed");
});

module.exports = app;
