import express from 'express';
import { appDataSource } from '../datasource.js';
import Ratings from '../entities/ratings.js';
import Movie from '../entities/movie.js';

const router = express.Router();

// ajoute ou met à jour notre note
router.post('/', async (req, res) => {
  const { user_id, movie_id, rating, comment } = req.body;
  if (!user_id || !movie_id || !rating) {
    return res.status(400).json({ error: 'user_id, movie_id et rating requis' });
  }

  const ratingsRepo = appDataSource.getRepository(Ratings);

  // check si une note existe déjà pour cet utilisateur et ce film
  let existing = await ratingsRepo.findOne({ where: { user_id, movie_id } });
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    await ratingsRepo.save(existing);
    return res.json(existing);
  } else {
    const newRating = ratingsRepo.create({ user_id, movie_id, rating, comment });
    await ratingsRepo.save(newRating);
    return res.json(newRating);
  }
});


router.get('/', async (req, res) => {
  const { user_id, movie_id } = req.query;
  if (!user_id || !movie_id) return res.status(400).json({ error: 'user_id et movie_id requis' });

  const ratingsRepo = appDataSource.getRepository(Ratings);
  const rating = await ratingsRepo.findOne({ where: { user_id, movie_id } });
  res.json(rating || {});
});

export default router;