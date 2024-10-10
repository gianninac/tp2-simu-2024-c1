import express from "express";
import {
  getMovie,
  getAllMovies,
  getAwardWinningMovies,
  getMoviesByLanguage,
  getMoviesSortedByFresh,
  getUserCommentsWithMovieDetails,
} from "../data/movies.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllMovies(pageSize, page));
});

// router.get("/id/:id", async (req, res) => {
//   res.json(await getMovie(req.params.id));
// });

// router.get("/awardWinners", async (req, res) => {
//   const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
//   const page = req.query.page ? parseInt(req.query.page) : 0;

//   res.json(await getAwardWinningMovies(pageSize, page));
// });

router.get("/comments/:userId", async (req, res) => {
  // const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  // const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getUserCommentsWithMovieDetails(req.params.userId));
});

router.get("/awardWinners", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAwardWinningMovies(pageSize, page));
});

router.get("/freshRanking", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getMoviesSortedByFresh(pageSize, page));
});

router.get("/:language", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getMoviesByLanguage(pageSize, page, req.params.language));
});

router.get("/:id", async (req, res) => {
  res.json(await getMovie(req.params.id));
});

export default router;
