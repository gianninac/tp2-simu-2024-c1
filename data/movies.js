import { ObjectId } from "mongodb";
import getConnection from "./conn.js";
const DATABASE = "sample_mflix";
const MOVIES = "movies";
const USERS = "users";
const COMMENTS = "comments";

export async function getAllMovies(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(COMMENTS)
    .find({})
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  console.log(
    "Las peliculas encontradas para pagina:" + page + "con tamaño:" + pageSize
  );
  console.log(movies);
  return movies;
}

export async function getMovie(id) {
  const connectiondb = await getConnection();
  const movie = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .findOne({ _id: new ObjectId(id) });
  return movie;
}

export async function getAwardWinningMovies(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find(
      { "awards.wins": { $gt: 0 } },
      { projection: { title: 1, poster: 1, plot: 1, _id: 0 } }
    )
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

export async function getMoviesByLanguage(pageSize, page, language) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ languages: language })
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

export async function getMoviesSortedByFresh(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ "tomatoes.fresh": { $exists: true } }) // Filtro para que solo incluya películas donde 'fresh' existe
    .project({ title: 1, "tomatoes.fresh": 1, _id: 0 }) //Para validar fácilmente el sorting by fresh value
    .sort({ "tomatoes.fresh": -1 }) // Ordenar de mayor a menor
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

export async function getUserCommentsWithMovieDetails(userId) {
  const connectiondb = await getConnection();

  // Obtener el email del usuario a partir de su _id
  const user = await connectiondb
    .db(DATABASE)
    .collection(USERS)
    .findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const email = user.email;

  // Obtener los comentarios del usuario utilizando su email
  const comments = await connectiondb
    .db(DATABASE)
    .collection(COMMENTS)
    .find({ email: email })
    // .limit(pageSize)
    // .skip(pageSize * page)
    .toArray();

  // Obtener los detalles de las películas correspondientes a los comentarios
  const movieIds = comments.map((comment) => new ObjectId(comment.movie_id));
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ _id: { $in: movieIds } })
    .toArray();

  // Crear un array de objetos que contengan los comentarios junto con el título y el póster de la película
  const result = comments.map((comment) => {
    // const movie = movies.find((movie) => movie._id.equals(comment.movie_id));
    const movie = movies.find(
      (movie) => movie._id.toString() === comment.movie_id.toString()
    );
    return {
      // commentId: comment._id,
      text: comment.text,
      // date: comment.date,
      movieTitle: movie ? movie.title : "Título no encontrado",
      moviePoster: movie ? movie.poster : "Póster no encontrado",
      // movieTitle: movie.title,
      // moviePoster: movie.poster,
    };
  });

  return result;
  // return comments;
}

// export { getAllMovies };
