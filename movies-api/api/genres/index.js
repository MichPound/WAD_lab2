import express from 'express';
import {
  getGenres
} from '../tmdb-api';

const router = express.Router();

router.get('/genres', (req, res, next) => {
  const id = parseInt(req.params.id);
  getGenres(id)
  .then(genres => res.status(200).send(genres))
  .catch((error) => next(error));
});

export default router;