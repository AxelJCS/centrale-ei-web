import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieDetail({ userId, userName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState([]);

  const GENRES = {
    28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie', 80: 'Crime', 99: 'Documentaire',
    18: 'Drame', 10751: 'Famille', 14: 'Fantastique', 36: 'Histoire', 27: 'Horreur', 10402: 'Musique',
    9648: 'Mystère', 10749: 'Romance', 878: 'Science-Fiction', 10770: 'Téléfilm', 53: 'Thriller',
    10752: 'Guerre', 37: 'Western', 10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News',
    10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
  };

  // Charger les com
  useEffect(() => {
    const saved = localStorage.getItem(`comments_${id}`);
    if (saved) setComments(JSON.parse(saved));
    else setComments([]);
  }, [id]);
  useEffect(() => {
    localStorage.setItem(`comments_${id}`, JSON.stringify(comments));
  }, [comments, id]);

  // Charger le film
  useEffect(() => {
    axios.get(`http://localhost:8000/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(() => setMovie(null));
  }, [id]);

  // Charger la note et le commentaire
  useEffect(() => {
    if (!userId || !movie?.id) return;
    axios.get(`http://localhost:8000/ratings?user_id=${userId}&movie_id=${movie.id}`)
      .then(res => {
        if (res.data && (res.data.rating || res.data.comment)) {
          setRating(res.data.rating || 0);
          setComment(res.data.comment || '');
        } else {
          setRating(0);
          setComment('');
        }
      });
  }, [userId, movie]);

  const handleClick = (star) => setRating(star);
  const handleDoubleClick = () => setRating(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 && comment.trim() === '') return;
    axios.post('http://localhost:8000/ratings', {
      user_id: userId,
      movie_id: movie.id,
      rating,
      comment,
    }).then(() => {
      // Ajoute dans Storage
      const newComment = {
        text: comment,
        rating,
        date: new Date().toLocaleString(),
        userId: userId,
        userName: userName || 'Utilisateur inconnu',
      };
      setComments([newComment, ...comments]);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setComment('');
      setRating(0);
    });
  };

  if (!movie) {
    return (
      <div style={{
        color: 'white',
        padding: '40px',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #232526 0%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        letterSpacing: '2px'
      }}>
        Chargement...
      </div>
    );
  }

  const isSerie = movie.type === 'tv' || movie.media_type === 'tv';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #232526 0%, #1e1e2f 100%)',
        color: 'white',
        padding: '40px 0',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <button
        onClick={() => {
          localStorage.setItem('introEnded', 'true');
          navigate('/');
        }}
        style={{
          marginLeft: '40px',
          marginBottom: '30px',
          padding: '10px 22px',
          background: 'linear-gradient(90deg, #e50914 60%, #b0060f 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0 4px 16px rgba(229,9,20,0.15)',
          transition: 'background 0.2s, transform 0.2s',
          position: 'relative',
          zIndex: 2
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ← Retour à l'accueil
      </button>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '50px',
          marginTop: '10px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              borderRadius: '18px',
              boxShadow: '0 8px 40px 0 #e5091440, 0 2px 8px #000a',
              width: '320px',
              maxWidth: '90vw',
              marginBottom: '20px',
              transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1)',
              objectFit: 'cover',
              filter: 'brightness(1.08) contrast(1.08)',
            }}
          />
        )}

        <div style={{
          maxWidth: '600px',
          background: 'rgba(30,30,47,0.92)',
          borderRadius: '18px',
          padding: '32px 32px 24px 32px',
          boxShadow: '0 4px 32px #000a',
          backdropFilter: 'blur(2px)',
        }}>
          <h1 style={{
            fontSize: '2.7rem',
            margin: 0,
            marginBottom: '10px',
            letterSpacing: '1px',
            fontWeight: 700,
            color: '#e50914',
            textShadow: '0 2px 12px #000a'
          }}>
            {movie.title || movie.name}
          </h1>
          <div style={{ display: 'flex', gap: '18px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{
              background: '#e50914',
              color: 'white',
              borderRadius: '12px',
              padding: '4px 14px',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '1px'
            }}>
              {movie.year || 'Année inconnue'}
            </span>
            <span style={{
              background: '#222',
              color: '#FFD700',
              borderRadius: '12px',
              padding: '4px 14px',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '1px'
            }}>
              Note : {movie.vote_average ?? 'Non noté'}
            </span>
            <span style={{
              background: '#232526',
              color: '#fff',
              borderRadius: '12px',
              padding: '4px 14px',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '1px'
            }}>
              {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0
                ? movie.genre_ids.map((id) => GENRES[parseInt(id, 10)] || id).join(', ')
                : 'Genre inconnu'}
            </span>
          </div>
          <p style={{
            fontSize: '1.15rem',
            color: '#eee',
            marginBottom: '18px',
            lineHeight: 1.6,
            textShadow: '0 1px 8px #0007'
          }}>
            {movie.overview}
          </p>

          <div style={{ marginTop: '20px', marginBottom: '10px' }}>
            <p style={{ marginBottom: '8px', fontWeight: 600, color: '#FFD700', fontSize: '1.1rem' }}>
              {isSerie
                ? 'À quel point as-tu apprécié cette série ?'
                : 'À quel point as-tu apprécié ce film ?'}
            </p>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleClick(star)}
                  onDoubleClick={handleDoubleClick}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    cursor: 'pointer',
                    fontSize: '2.2rem',
                    color: (hover || rating) >= star ? '#FFD700' : '#555',
                    marginRight: '8px',
                    transition: 'color 0.2s, transform 0.2s',
                    userSelect: 'none',
                    filter: (hover || rating) >= star ? 'drop-shadow(0 0 6px #FFD70088)' : 'none',
                    transform: (hover || rating) === star ? 'scale(1.25)' : 'scale(1)'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && (
              <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#4CAF50' }}>
                Merci pour ta note !
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '25px' }}>
            <label htmlFor="comment" style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 600,
              color: '#e50914',
              fontSize: '1.1rem'
            }}>
              {isSerie ? 'Un commentaire sur la série ?' : 'Un commentaire sur le film ?'}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid #e50914',
                resize: 'none',
                fontSize: '1rem',
                background: '#181824',
                color: 'white',
                marginBottom: '10px',
                outline: 'none',
                boxShadow: '0 2px 8px #0004',
                transition: 'border 0.2s'
              }}
              placeholder={isSerie
                ? "Écris ce que tu as pensé de la série..."
                : "Écris ce que tu as pensé du film..."}
            />
            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '10px 28px',
                background: 'linear-gradient(90deg, #4CAF50 60%, #388e3c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 16px rgba(76,175,80,0.15)',
                transition: 'background 0.2s, transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Envoyer
            </button>
          </form>

          {submitted && (
            <p style={{ marginTop: '15px', color: '#4CAF50', fontWeight: 600, fontSize: '1.1rem' }}>
              Merci pour ton avis ! 🎬
            </p>
          )}

          {comments.length > 0 && (
            <div style={{ marginTop: '35px' }}>
              <h3 style={{ color: '#FFD700', marginBottom: '12px' }}>
                Commentaires des spectateurs sur {isSerie ? 'la série' : 'le film'} :
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {comments.map((c, idx) => (
                  <li key={idx} style={{
                    background: '#232526',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginBottom: '12px',
                    color: '#fff',
                    boxShadow: '0 2px 8px #0003'
                  }}>
                    <div style={{ marginBottom: '6px' }}>
                      {c.rating > 0 && (
                        <span style={{ color: '#FFD700', fontWeight: 700, marginRight: '8px' }}>
                          {'★'.repeat(c.rating)}
                          {'☆'.repeat(5 - c.rating)}
                        </span>
                      )}
                      <span style={{ color: '#aaa', fontSize: '0.95em', marginLeft: '8px' }}>
                        {c.date} - Par : {c.userName || 'Utilisateur inconnu'}
                      </span>
                    </div>
                    <div style={{ whiteSpace: 'pre-line' }}>{c.text}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MovieDetail;