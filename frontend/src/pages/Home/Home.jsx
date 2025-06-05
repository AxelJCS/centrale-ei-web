import { useState, useEffect } from 'react';
import Movie from '../Movie/Movie';
import { useFetchMovies } from './useFetchMovies';
import netflixLogo from './netflix.png';
import introVideo from './Netflics.mp4';
import surprise from './videoplayback.mp4';
import GENRES from './genres';
localStorage.removeItem('introEnded'); // Force l'affichage de l'intro à chaque F5

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('movie');
  const [genre, setGenre] = useState('');
  const [introEnded, setIntroEnded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [likedGenres, setLikedGenres] = useState([]);

  const moviesPerSlide = 7;

  // Splash screen
  useEffect(() => {
    const introAlreadyEnded = localStorage.getItem('introEnded') === 'true';
    setIntroEnded(introAlreadyEnded);
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setPage(1);
    setCurrentSlide(0);
  }, [searchTerm, type, genre, showSuggestions]);

  // Fetch movies
  const { items, loading, error } = useFetchMovies(
    searchTerm,
    page,
    type,
    showSuggestions && likedGenres.length > 0 ? likedGenres[0] : genre
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    if (type === 'movie') {
      return item.media_type === 'movie' || item.type === 'movie';
    } else if (type === 'tv') {
      return item.media_type === 'tv' || item.type === 'tv' || item.name;
    }
    return true;
  });

  // Carousel calculations
  const totalSlides = Math.max(1, Math.ceil(filteredItems.length / moviesPerSlide));
  const startIdx = currentSlide * moviesPerSlide;
  const endIdx = startIdx + moviesPerSlide;
  const visibleMovies = filteredItems.slice(startIdx, endIdx);

  // Genres
  const MOVIE_GENRE_IDS = [
    28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37
  ];
  const TV_GENRE_IDS = [
    10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766, 10767, 10768, 37
  ];
  const genreIdsToShow = type === 'movie' ? MOVIE_GENRE_IDS : TV_GENRE_IDS;
  const filteredGenres = Object.entries(GENRES).filter(([id]) =>
    genreIdsToShow.includes(Number(id))
  );

  // Splash screen end
  function handleIntroEnd() {
    setIntroEnded(true);
    localStorage.setItem('introEnded', 'true');
  }

  // Surprise video
  function handleLoadMore() {
    setShowVideo(true);
  }
  function handleCloseVideo() {
    setShowVideo(false);
    setPage((p) => p + 1);
  }

  // Scroll to top
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Movie aléatoire
  function handleRandomMovie() {
    if (filteredItems.length > 0) {
      const random = filteredItems[Math.floor(Math.random() * filteredItems.length)];
      setRandomMovie(random);
      setTimeout(() => setRandomMovie(null), 3500);
    }
  }

  // Suggestions utilisateur (simulateur simple)
  function handleShowSuggestions() {
    // Simule les genres préférés (ici, on prend les 2 derniers genres consultés)
    let newLikedGenres = [...likedGenres];
    if (genre && !newLikedGenres.includes(genre)) {
      newLikedGenres = [...newLikedGenres, genre];
      if (newLikedGenres.length > 3) newLikedGenres = newLikedGenres.slice(-3);
      setLikedGenres(newLikedGenres);
    }
    setShowSuggestions(true);
    setCurrentSlide(0);
  }

  function handleShowPopular() {
    setShowSuggestions(false);
    setGenre('');
    setCurrentSlide(0);
  }

  // Dark overlay for random movie
  const randomMovieOverlay = randomMovie && (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.93)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.5s',
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${randomMovie.poster_path}`}
        alt={randomMovie.title || randomMovie.name}
        style={{
          borderRadius: '18px',
          boxShadow: '0 0 40px #e50914cc, 0 8px 32px #000b',
          width: '220px',
          marginBottom: '20px',
          animation: 'popIn 0.7s',
        }}
      />
      <h2 style={{
        color: '#FFD700',
        fontSize: '2rem',
        marginBottom: '10px',
        textShadow: '0 2px 12px #000a'
      }}>
        🎲 Film/Série surprise !
      </h2>
      <h3 style={{ color: '#e50914', marginBottom: '10px' }}>
        {randomMovie.title || randomMovie.name}
      </h3>
      <p style={{ color: '#fff', maxWidth: 400, textAlign: 'center', marginBottom: 0 }}>
        {randomMovie.overview}
      </p>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        `}
      </style>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top left, #1e1e2f 60%, #000 100%)',
        color: 'white',
        position: 'relative',
        padding: '40px 20px',
        overflowX: 'hidden',
      }}
    >
      {/* Splash screen */}
      {!introEnded && (
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleIntroEnd}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 9999,
            backgroundColor: 'black',
            animation: 'fadeOut 1s ease forwards',
            animationDelay: '0.5s',
          }}
        >
          <source src={introVideo} type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
      )}

      {/* Overlay random movie */}
      {randomMovieOverlay}

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '10px 40px 10px 20px',
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          boxShadow: '0 2px 16px #e5091440',
          height: '60px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={netflixLogo}
            alt="Logo Netflix"
            style={{ height: '40px', cursor: 'pointer', userSelect: 'none' }}
          />
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => {
                setType('movie');
                setCurrentSlide(0);
              }}
              style={{
                padding: '8px 16px',
                fontSize: '1rem',
                borderRadius: '5px',
                border: type === 'movie' ? '2px solid #e50914' : '1px solid #ccc',
                backgroundColor: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '1px',
                boxShadow: type === 'movie' ? '0 2px 12px #e5091440' : 'none',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
            >
              Films
            </button>
            <button
              onClick={() => {
                setType('tv');
                setCurrentSlide(0);
              }}
              style={{
                padding: '8px 16px',
                fontSize: '1rem',
                borderRadius: '5px',
                border: type === 'tv' ? '2px solid #e50914' : '1px solid #ccc',
                backgroundColor: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '1px',
                boxShadow: type === 'tv' ? '0 2px 12px #e5091440' : 'none',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
            >
              Séries TV
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginRight: '60px' }}>
          <button
            onClick={handleShowPopular}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              background: showSuggestions ? 'transparent' : 'linear-gradient(90deg, #FFD700 60%, #e50914 100%)',
              color: showSuggestions ? '#FFD700' : '#1e1e2f',
              fontWeight: 'bold',
              fontSize: '1rem',
              border: showSuggestions ? '2px solid #FFD700' : 'none',
              cursor: 'pointer',
              boxShadow: showSuggestions ? 'none' : '0 2px 12px #FFD70040',
              transition: 'background 0.2s, color 0.2s, border 0.2s',
              letterSpacing: '1px',
            }}
          >
            🔥 Populaires
          </button>
          <button
            onClick={handleShowSuggestions}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              background: showSuggestions ? 'linear-gradient(90deg, #FFD700 60%, #e50914 100%)' : 'transparent',
              color: showSuggestions ? '#1e1e2f' : '#FFD700',
              fontWeight: 'bold',
              fontSize: '1rem',
              border: showSuggestions ? 'none' : '2px solid #FFD700',
              cursor: 'pointer',
              boxShadow: showSuggestions ? '0 2px 12px #FFD70040' : 'none',
              transition: 'background 0.2s, color 0.2s, border 0.2s',
              letterSpacing: '1px',
            }}
          >
            💡 Suggestions pour vous
          </button>
          <button
            onClick={handleRandomMovie}
            style={{
              padding: '8px 22px',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, #FFD700 60%, #e50914 100%)',
              color: '#1e1e2f',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 12px #FFD70040',
              transition: 'background 0.2s, transform 0.2s',
              letterSpacing: '1px',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎲 Essaie-moi !
          </button>
        </div>
      </header>

      {/* Logo Netflix en fond */}
      <img
        src={netflixLogo}
        alt="Logo en fond"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.12,
          width: '700px',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      />

      {/* Champ de recherche */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '90px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2 style={{ marginBottom: '10px', letterSpacing: '1px' }}>
          Rechercher, ici :
        </h2>
        <input
          type="text"
          placeholder={`Insérer le nom de votre ${type === 'movie' ? 'film' : 'série'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '320px',
            padding: '12px',
            fontSize: '1.1rem',
            borderRadius: '8px',
            border: '2px solid #e50914',
            boxShadow: '0 2px 16px #e5091440',
            background: '#181818',
            color: 'white',
            outline: 'none',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => e.target.style.border = '2.5px solid #FFD700'}
          onBlur={e => e.target.style.border = '2px solid #e50914'}
        />
      </div>

      {/* Filtres */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <label style={{ marginRight: '10px', fontWeight: 600, color: '#FFD700' }}>Filtrer par genre :</label>
        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '5px',
            background: '#181818',
            color: 'white',
            border: '1.5px solid #FFD700',
            outline: 'none',
            fontWeight: 600,
          }}
        >
          <option value="">Tous</option>
          {filteredGenres.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      {/* Titre de section */}
      <h1
        style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '2px',
          textShadow: '0 4px 24px #e5091440, 0 2px 8px #FFD70040',
        }}
      >
        {showSuggestions
          ? 'Notre algorithme vous connaît mieux que votre meilleur pote cinéphile'
          : type === 'movie'
            ? 'Films populaires en ce moment'
            : 'Séries TV populaires en ce moment'}
      </h1>

      {/* Messages de chargement / erreur */}
      {loading && (
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            fontSize: '1.2rem',
            letterSpacing: '1px',
          }}
        >
          Chargement {type === 'movie' ? 'des films' : 'des séries'}…
        </p>
      )}

      {error && (
        <p
          style={{
            color: 'red',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            fontWeight: 'bold',
          }}
        >
          Erreur lors du chargement {type === 'movie' ? 'des films' : 'des séries'}.
        </p>
      )}

      {/* Carrousel horizontal */}
      {filteredItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            zIndex: 1,
            marginBottom: '30px',
          }}
        >
          {/* Flèche gauche */}
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            style={{
              backgroundColor: 'transparent',
              color: currentSlide === 0 ? 'gray' : '#FFD700',
              fontSize: '2.5rem',
              border: 'none',
              cursor: currentSlide === 0 ? 'default' : 'pointer',
              transition: 'color 0.2s, transform 0.2s',
              transform: currentSlide === 0 ? 'scale(1)' : 'scale(1.2)',
              filter: currentSlide === 0 ? 'none' : 'drop-shadow(0 0 8px #FFD700cc)',
            }}
            aria-label="Précédent"
          >
            ◀
          </button>

          {/* Zone de films visibles */}
          <div
            style={{
              display: 'flex',
              overflow: 'hidden',
              width: 'calc(7 * 180px + 6 * 20px)',
              gap: '20px',
              transition: 'transform 0.5s cubic-bezier(.22,1.12,.58,1)',
            }}
          >
            {visibleMovies.map((item, idx) => (
              <Movie key={item.id} movie={item} rank={startIdx + idx + 1} />
            ))}
          </div>

          {/* Flèche droite */}
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlide >= totalSlides - 1}
            style={{
              backgroundColor: 'transparent',
              color: currentSlide >= totalSlides - 1 ? 'gray' : '#FFD700',
              fontSize: '2.5rem',
              border: 'none',
              cursor: currentSlide >= totalSlides - 1 ? 'default' : 'pointer',
              transition: 'color 0.2s, transform 0.2s',
              transform: currentSlide >= totalSlides - 1 ? 'scale(1)' : 'scale(1.2)',
              filter: currentSlide >= totalSlides - 1 ? 'none' : 'drop-shadow(0 0 8px #FFD700cc)',
            }}
            aria-label="Suivant"
          >
            ▶
          </button>
        </div>
      )}

      {/* Aucun film trouvé */}
      {items.length === 0 && !loading && (
        <p
          style={{
            fontStyle: 'italic',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Aucun {type === 'movie' ? 'film' : 'série'} trouvé.
        </p>
      )}

      {/* Bouton voir plus */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          onClick={handleLoadMore}
          disabled={loading || showVideo}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: 'none',
            cursor: loading || showVideo ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(90deg, #FFD700 60%, #e50914 100%)',
            color: '#1e1e2f',
            fontWeight: 'bold',
            boxShadow: '0 2px 12px #FFD70040',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Voir plus
        </button>
      </div>

      {/* Vidéo surprise */}
      {showVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.93)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            flexDirection: 'column',
          }}
        >
          <video
            src={surprise}
            controls
            autoPlay
            style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '10px' }}
            onEnded={handleCloseVideo}
          />
          <button
            onClick={handleCloseVideo}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(90deg, #FFD700 60%, #e50914 100%)',
              color: '#1e1e2f',
              fontWeight: 'bold',
              boxShadow: '0 2px 12px #FFD70040',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Fermer la vidéo
          </button>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: 'linear-gradient(90deg, #FFD700 60%, #e50914 100%)',
            color: '#1e1e2f',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 16px #FFD70080',
            cursor: 'pointer',
            zIndex: 2001,
            transition: 'background 0.2s, transform 0.2s',
          }}
          title="Remonter en haut"
          aria-label="Remonter en haut"
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Home;
