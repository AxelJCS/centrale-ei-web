import { Link } from 'react-router-dom';
import { useState } from 'react'; 

function Movie({ movie, rank }) {

  const releaseDate = movie.release_date || movie.first_air_date || '';
  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';


  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/movie/${movie.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          position: 'relative',
          width: '170px',
          backgroundColor: '#222',
          borderRadius: '8px',
          overflow: 'hidden',
          color: 'white',
          boxShadow: '0 0 10px rgba(0,0,0,0.7)',
        }}
        onMouseEnter={() => setHovered(true)}  
        onMouseLeave={() => setHovered(false)} 
      >
        {rank && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#e50914',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)',
              zIndex: 10,
            }}
          >
            {rank}
          </div>
        )}

        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title || movie.name}
          style={{
            width: '100%',
            display: 'block',
            transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1)',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            zIndex: hovered ? 2 : 1,
          }}
        />

        <div style={{ padding: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', minHeight: '40px' }}>
            {movie.title || movie.name}
          </h3>
          {formattedDate && (
            <p
              style={{
                margin: '5px 0 0 0',
                fontSize: '0.85rem',
                color: '#bbb',
              }}
            >
              {formattedDate}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Movie;