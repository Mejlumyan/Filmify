import { useEffect, useState } from "react";
import { movieService } from "../../../services/movieService";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/axios";
import "./Search.scss";


export const Search = () => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searchMovie = async () => {
      if (!title.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await movieService.searchMovie(title);
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    };

    const delay = setTimeout(searchMovie, 300);
    return () => clearTimeout(delay);
  }, [title]);

 
  const getSearchImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const cleanPath = path.replace("/not/", "/");
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    return `${API_URL}${finalPath}`;
  };

  return (
    <div className="search-wrap">
      <MagnifyingGlassIcon className="search-icon" />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Search movies..."
        className="search-input"
      />


      <AnimatePresence>
        {results.length > 0 && title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="search-dropdown"
          >
            {results.map((movie) => (
              <div
                key={movie._id}
                onClick={() => {
                  navigate(`/movie/${movie._id}`);
                  setTitle(""); 
                }}
                className="search-result-item"
              >
                <img
                  src={getSearchImageUrl(movie.posterUrl || movie.imageUrl)}
                  className="search-result-item__image"
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/32x40?text=No";
                  }}
                />
                <div className="search-result-item__info">
                  <span className="search-result-item__title">
                    {movie.title}
                  </span>
                  <span className="search-result-item__genre">
                    {movie.genre}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};