import express from 'express';
import { appDataSource } from '../datasource.js';
import Ratings from '../entities/ratings.js';
import Movie from '../entities/movie.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { user_id, type } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id requis' });

  const uid = Number(user_id);
  const ratingsRepo = appDataSource.getRepository(Ratings);
  const moviesRepo = appDataSource.getRepository(Movie);

  // Récupère les notes de l'utilisateur courant
  const userRatings = await ratingsRepo.find({ where: { user_id: uid } });
  const userMovieMap = Object.fromEntries(userRatings.map(r => [r.movie_id, r.rating]));
  const userMovieIds = Object.keys(userMovieMap).map(Number);

  if (userMovieIds.length === 0) return res.json([]);

  // Récupère les notes des autres utilisateurs sur les mêmes films
  const similarRatings = await ratingsRepo
    .createQueryBuilder('r')
    .where('r.movie_id IN (:...userMovieIds)', { userMovieIds })
    .andWhere('r.user_id != :user_id', { user_id: uid })
    .getMany();

  // Grouper les notes par utilisateur
  const otherUsers = {};
  for (const r of similarRatings) {
    if (!otherUsers[r.user_id]) otherUsers[r.user_id] = [];
    otherUsers[r.user_id].push(r);
  }

  // Calcul de la similarité via Cosine Similarity
  function cosineSimilarity(userA, userB) {
    const common = userA.filter(rA => userB.some(rB => rB.movie_id === rA.movie_id));
    if (common.length === 0) return 0;

    let dot = 0, normA = 0, normB = 0;

    for (const rA of common) {
      const rB = userB.find(rb => rb.movie_id === rA.movie_id);
      dot += rA.rating * rB.rating;
      normA += rA.rating ** 2;
      normB += rB.rating ** 2;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  // Calcul de la similarité
  const similarities = Object.entries(otherUsers).map(([id, ratings]) => ({
    user_id: Number(id),
    similarity: cosineSimilarity(userRatings, ratings)
  })).filter(u => u.similarity > 0);

  const topSimilarUsers = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);

  if (topSimilarUsers.length === 0) return res.json([]);

  const similarUserIds = topSimilarUsers.map(u => u.user_id);

  // Recommandations
  const recommendedRatings = await ratingsRepo
    .createQueryBuilder('r')
    .where('r.user_id IN (:...similarUserIds)', { similarUserIds })
    .andWhere('r.movie_id NOT IN (:...userMovieIds)', { userMovieIds })
    .andWhere('r.rating >= 3.5')
    .getMany();

  const scores = {};
  for (const r of recommendedRatings) {
    const sim = topSimilarUsers.find(u => u.user_id === r.user_id)?.similarity || 0;
    if (!scores[r.movie_id]) scores[r.movie_id] = { score: 0, count: 0 };
    scores[r.movie_id].score += sim * r.rating;
    scores[r.movie_id].count++;
  }

  // Top 5 films par score pondéré
  const sortedMovieEntries = Object.entries(scores)
    .sort((a, b) => (b[1].score / b[1].count) - (a[1].score / a[1].count))
    .slice(0, 5);

  const topMovieIds = sortedMovieEntries.map(([id]) => Number(id));

  // Récupérer les films
  let movies = topMovieIds.length ? await moviesRepo.findByIds(topMovieIds) : [];

  if (type) {
    movies = movies.filter(m => m.type === type);
  }

  // Réordonner selon la pertinence
  movies.sort((a, b) => topMovieIds.indexOf(a.id) - topMovieIds.indexOf(b.id));

  // Ajouter un score de pertinence
  const response = movies.map(movie => {
    const scoreData = scores[movie.id];
    const pertinence = scoreData ? (scoreData.score / scoreData.count).toFixed(2) : null;
    return { ...movie, pertinence: Number(pertinence) };
  });

  res.json(response);
});

export default router;
