import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { movieService } from "../../../services/movieService";
import { API_URL } from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import "./Discover.scss";

const GENRES = ["Action","Crime","Fantastic", "Fighter",  "Hard Science Fiction", "Comedy", "Horror", "Drama"];

export const Discover = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [genreIndex, setGenreIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await movieService.getAllMovies();
        const data = res.data.data || res.data;
        setAllMovies(data);
        setFilteredMovies(data);
      } catch (err) {
        console.error("Discover error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedGenre === "All") {
      const timer = setInterval(() => {
        setGenreIndex((prev) => (prev + 1) % GENRES.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [selectedGenre]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    const filtered = genre === "All" ? allMovies : allMovies.filter(m => m.genre?.toLowerCase().includes(genre.toLowerCase()));
    setFilteredMovies(filtered);
    if (genre !== "All") setGenreIndex(GENRES.indexOf(genre));
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    const cleanPath = path.replace("/not/", "/");
    return `${API_URL}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
  };

  if (loading) return (
    <div className="discover-loading">
      <div className="discover-loading__bar" />
    </div>
  );

  return (
    <div className="discover-page">

      <header className="discover-header">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="discover-title">
            Now in <span className="discover-title__cinema">Filmify</span>
          </h1>
          <div className="genre-filter">
            {["All", ...GENRES].map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`genre-btn${isActive ? " genre-btn--active" : ""}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="balancedTab"
                      className="genre-btn__bg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="genre-btn__label">
                    {genre}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </header>

      <motion.div layout className="movies-grid">
        <AnimatePresence mode="popLayout">
          {filteredMovies.map((movie) => (
            <motion.div
              key={movie._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/movie/${movie._id}`)}
              className="discover-movie"
            >
              <div className="discover-movie__poster-wrap">
                <img
                  src={getImageUrl(movie.posterUrl || movie.imageUrl)}
                  className="discover-movie__poster"
                  alt={movie.title}
                />
                <div className="discover-movie__overlay">
                  <div className="discover-movie__badge">{movie.genre}</div>
                  <h4 className="discover-movie__title-text">{movie.title}</h4>
                </div>
              </div>

              <div className="discover-movie__footer">
                <span className="discover-movie__label">
                  {movie.title}
                </span>
                <motion.div
                  className="discover-movie__underline"
                  initial={{ width: 0 }}
                  whileHover={{ width: "50%" }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="discover-bg-text">
        {selectedGenre === "All" ? "CINEMA" : selectedGenre}
      </div>
    </div>
  );
};