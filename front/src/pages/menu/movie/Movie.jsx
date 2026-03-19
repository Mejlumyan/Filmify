import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../../../services/movieService";
import { API_URL } from "../../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, ChevronLeft, ArrowRight, X } from "lucide-react";
import "./Movie.scss";

export const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await movieService.getMovieById(id);
        setMovie(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieDetails();
  }, [id]);

  const getFullImageUrl = (path) => {
    if (!path) return "";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  const images = useMemo(() => {
    if (!movie) return { backdrop: "", poster: "" };
    const bgPath = movie.imageUrl?.includes("/not/")
      ? movie.imageUrl
      : movie.imageUrl?.replace("/uploads/", "/uploads/not/");

    return {
      backdrop: getFullImageUrl(bgPath || ""),
      poster: getFullImageUrl(movie.posterUrl?.replace("/not/", "/") || "")
    };
  }, [movie]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  if (loading) return (
    <div className="movie-loading">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="movie-loading__bar"
      />
    </div>
  );

  if (!movie) return null;

  return (
    <div className="movie-page">

      <div className="movie-bg">
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2 }}
          src={images.backdrop}
          className="movie-bg__image"
          alt="background"
        />
        <div className="movie-bg__overlay-right" />
        <div className="movie-bg__overlay-bottom" />
      </div>

      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate(-1)}
        className="movie-back-btn"
      >
        <div className="movie-back-btn__circle">
          <ChevronLeft size={18} />
        </div>
        <span className="movie-back-btn__label">Back</span>
      </motion.button>

      <div className="movie-content">
        <div className="movie-content__inner">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 1 }}
            className="movie-poster"
          >
            <motion.img
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={images.poster}
              className="movie-poster__img"
              alt={movie.title}
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="movie-info"
          >
            <motion.div variants={itemVariants} className="movie-meta">
              <span className="movie-meta__badge">
                {movie.genre}
              </span>
              <div className="movie-meta__rating">
                <Star size={14} fill="currentColor" />
                <span>{movie.rating || "9.0"}</span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="movie-title"
            >
              {movie.title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="movie-description"
            >
              {movie.description}
            </motion.p>

            <motion.div variants={itemVariants} className="movie-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  const res = await movieService.getMovieTrailer(id);
                  setTrailerUrl(getFullImageUrl(res.data.data?.videoUrl || movie.videoUrl));
                  setShowTrailer(true);
                }}
                className="movie-btn"
              >
                <Play size={18} fill="currentColor" /> Watch Trailer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#f5f505", color: "#111" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/cinema/${movie.cinema}/${movie._id || id}`)}
                className="movie-btn movie-btn--secondary"
              >
                Buy Ticket
                <ArrowRight size={18} className="movie-btn__arrow" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showTrailer && trailerUrl && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="trailer-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="trailer-overlay__inner"
            >
              <button onClick={() => setShowTrailer(false)} className="trailer-close">
                <X size={24} />
              </button>
              <video src={trailerUrl} controls autoPlay className="trailer-overlay__video" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
