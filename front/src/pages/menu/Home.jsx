import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { movieService } from "../../services/movieService";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/axios";
import { Play, Star, Zap } from "lucide-react";
import "./Home.scss";

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await movieService.getAllMovies();
        const movieData = moviesRes.data.data || moviesRes.data;

        if (Array.isArray(movieData)) {
          setMovies(movieData);
          const randomSix = [...movieData]
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);
          setHeroMovies(randomSix);
          
          const rated = [...movieData]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 6);
          setTopRated(rated);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroMovies.length > 0) {
      const interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % heroMovies.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [heroMovies.length]);

  const getFullImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  if (loading)
    return (
      <div className="home-loading">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="home-loading__spinner"
        />
        <div className="home-loading__text">
          Loading Filmify<span className="home-loading__accent">...</span>
        </div>
      </div>
    );

  const currentHeroMovie = heroMovies[imgIndex];

  return (
    <div className="home-page">
      <section className="hero-section">
        <AnimatePresence>
          {heroMovies.length > 0 ? (
            <motion.div
              key={currentHeroMovie?._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="hero-section__bg"
            >
              <motion.img
                src={getFullImageUrl(
                  currentHeroMovie.imageUrl?.includes("/not/")
                    ? currentHeroMovie.imageUrl
                    : currentHeroMovie.imageUrl?.replace("/uploads/", "/uploads/not/"),
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="hero-section__image"
              />
            </motion.div>
          ) : (
            <div className="hero-section__empty">No Banner Available</div>
          )}
        </AnimatePresence>

        <div className="hero-section__overlay" />

        <div className="hero-section__content">
          <AnimatePresence mode="wait">
            {currentHeroMovie && (
              <motion.div 
                key={currentHeroMovie._id} 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7 }}
              >
                <motion.h1 
                  className="hero-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {currentHeroMovie.title}
                </motion.h1>

                <motion.p 
                  className="hero-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                >
                  {currentHeroMovie.description || "Experience an unforgettable  journey"}
                </motion.p>

                <motion.div 
                  className="hero-meta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="hero-meta__item">
                    <Star size={16} fill="currentColor" />
                    <span>{currentHeroMovie.rating || "8.5"}</span>
                  </div>
                  <div className="hero-meta__item">
                    {currentHeroMovie.genre}
                  </div>
                </motion.div>

                <motion.div 
                  className="hero-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/movie/${currentHeroMovie._id}`)}
                    className="hero-btn hero-btn--primary"
                  >
                    <Play size={18} fill="currentColor" />
                    Explore Movie
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/cinema/${currentHeroMovie.cinema}/${currentHeroMovie._id}`)}
                    className="hero-btn hero-btn--secondary"
                  >
                    Book Tickets
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="hero-dots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {heroMovies.slice(0, 10).map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      animate={{
                        width: i === imgIndex ? 32 : 8,
                        backgroundColor: i === imgIndex ? "#f5f505" : "rgba(255,255,255,0.3)",
                      }}
                      className="hero-dot"
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {currentHeroMovie && (
              <motion.div 
                key={`badge-${currentHeroMovie._id}`}
                className="hero-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Zap size={14} />
                Featured Now
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="top-rated-section"
      >
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-title__line"></span>
              Top Rated
            </h2>
            <p className="section-subtitle">Most loved films by our community</p>
          </div>
        </div>

        <div className="movie-grid">
          {topRated.map((movie, idx) => (
            <motion.div 
              key={movie._id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <MovieCard movie={movie} getFullImageUrl={getFullImageUrl} navigate={navigate} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="in-theaters-section"
      >
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-title__line"></span>
              In Theaters Now
            </h2>
            <p className="section-subtitle">Fresh releases available this season</p>
          </div>
        </div>

        <div className="movie-grid">
          {movies.slice(0, 6).map((movie, idx) => (
            <motion.div 
              key={movie._id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <MovieCard movie={movie} getFullImageUrl={getFullImageUrl} navigate={navigate} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

const MovieCard = ({ movie, getFullImageUrl, navigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="movie-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="movie-card__poster-wrap">
        <motion.img
          src={getFullImageUrl(movie.posterUrl?.replace("/not/", "/"))}
          className="movie-card__image"
          alt={movie.title}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="movie-card__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="movie-card__content">
                <h3 className="movie-card__overlay-title">{movie.title}</h3>
                <p className="movie-card__genre">{movie.genre}</p>
                
                <div className="movie-card__rating">
                  <Star size={14} fill="currentColor" />
                  <span>{movie.rating || "8.5"}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="movie-card__btn"
                >
                  <Play size={14} fill="currentColor" />
                  View Details
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="movie-card__badge">
          {movie.rating && (
            <>
              <Star size={12} fill="currentColor" />
              {movie.rating}
            </>
          )}
        </div>
      </div>
      
      <div className="movie-card__footer">
        <h3 className="movie-card__title">{movie.title}</h3>
      </div>
    </motion.div>
  );
};
