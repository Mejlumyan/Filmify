import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../../../services/movieService";
import { API_URL } from "../../../config/axios";
import { motion } from "framer-motion";
import { ChevronLeft, PlayCircle } from "lucide-react";
import "./MovieGenres.scss";

export const MovieGenre = () => {
    const { genreName } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            try {
                setLoading(true);
                const res = await movieService.getAllMovies();
                const allMovies = res.data.data || res.data;

                if (genreName?.toLowerCase() === "all") {
                    setMovies(allMovies);
                } else {
                    const filtered = allMovies.filter((m) =>
                        m.genre?.toLowerCase().includes(genreName?.toLowerCase() || "")
                    );
                    setMovies(filtered);
                }
            } catch (err) {
                console.error("Genre fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesByGenre();
    }, [genreName]);

    if (loading) return (
        <div className="genre-loading">
            <div className="genre-loading__bar" />
        </div>
    );

    return (
        <div className="genre-page">

            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="genre-back-btn"
            >
                <div className="genre-back-btn__circle">
                    <ChevronLeft size={18} />
                </div>
                <span className="genre-back-btn__label">Back</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="genre-header"
            >
                <p className="genre-header__label">Category</p>
                <h2 className="genre-header__title">
                    {genreName} <span className="genre-header__title--muted">Collections</span>
                </h2>
            </motion.div>

            <div className="genre-grid">
                {movies.map((movie, index) => (
                    <motion.div
                        key={movie._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/movie/${movie._id}`)}
                        className="genre-movie"
                    >
                        <div className="genre-movie__poster-wrap">
                            <img
                                src={`${API_URL}${movie.posterUrl}`}
                                className="genre-movie__poster"
                                alt={movie.title}
                            />

                            <div className="genre-movie__hover-overlay">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="genre-movie__play-btn"
                                >
                                    <PlayCircle size={32} fill="currentColor" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="genre-movie__info">
                            <div className="genre-movie__genre-tag">{movie.genre}</div>
                            <h3 className="genre-movie__title">{movie.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {movies.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="genre-empty"
                >
                    <div className="genre-empty__text">Empty</div>
                    <p className="genre-empty__subtext">No movies found in this genre</p>
                </motion.div>
            )}
        </div>
    );
};