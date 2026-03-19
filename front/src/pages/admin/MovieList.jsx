import "./MovieList.scss";
import { useEffect, useState } from "react";
import { movieService } from "../../services/movieService";
import { cinemaService } from "../../services/cinemaService";
import {
  Trash2,
  Search,
  Pencil,
  X,
  Save,
  Clapperboard,
  Video,
  LayoutGrid, 
  Calendar,
  DollarSign,
  Star,
  Layers,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config/axios";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  useEffect(() => {
    fetchMovies();
    fetchCinemas();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await movieService.getAllMovies();
      const data = res.data.data || res.data;
      if (Array.isArray(data)) setMovies(data);
    } catch (err) {
      console.error("Failed to fetch movies", err);
    }
  };

  const fetchCinemas = async () => {
    try {
      const res = await cinemaService.getAllCinemas();
      const data = res.data.data || res.data;
      if (Array.isArray(data)) setCinemas(data);
    } catch (err) {
      console.error("Failed to fetch cinemas", err);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace("/not/", "/");
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${API_URL}${finalPath}`;
  };

  const handleDelete = (movie) => {
    setMovieToDelete(movie);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    setLoading(true);
    try {
      const res = await movieService.deleteMovie(movieToDelete._id);
      if (res.data.success || res.status === 200) {
        setMovies((prev) => prev.filter((m) => m._id !== movieToDelete._id));
        setIsDeleteModalOpen(false);
        setMovieToDelete(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie({ ...movie });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingMovie) return;
    setLoading(true);
    try {
      const res = await movieService.updateMovie(
        editingMovie._id,
        editingMovie,
      );
      if (res.data.success || res.status === 200) {
        setMovies((prev) =>
          prev.map((m) => (m._id === editingMovie._id ? editingMovie : m)),
        );
        setIsEditModalOpen(false);
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="movie-list-page">
      <div className="movie-list-inner">
        <div className="movie-list-header">
          <div className="movie-list-header__content">
            <h2 className="movie-list-title">
              Film Archive
            </h2>
            <p className="movie-list-subtitle">Search for Administrator</p>
          </div>

          <div className="movie-list-search">
            <Search className="movie-list-search__icon" />
            <input
              type="text"
              placeholder="Search Movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="movie-list-search__input"
            />
          </div>
        </div>

        <div className="movie-list-cards">
          <AnimatePresence>
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="movie-list-card"
              >
                <div className="movie-list-card__content">
                  <img
                    src={getImageUrl(movie.posterUrl || movie.imageUrl)}
                    alt={movie.title}
                    className="movie-list-card__image"
                  />
                  <div className="movie-list-card__body">
                    <h3 className="movie-list-card__title">{movie.title}</h3>
                    {movie.description && (
                      <p className="movie-list-card__description">{movie.description}</p>
                    )}
                    <div className="movie-list-card__meta">
                      <span className="movie-list-card__genre">
                        {movie.genre}
                      </span>
                      <span className="movie-list-card__meta-item">
                        <LayoutGrid size={12} /> Hall #{cinemas.find((c) => c._id === movie.cinema)?.numbering || "N/A"}
                      </span>
                      <span className="movie-list-card__meta-item">
                        <DollarSign size={12} /> {movie.price} AMD
                      </span>
                      {movie.releaseDate && (
                        <span className="movie-list-card__meta-item movie-list-card__meta-item--purple">
                          <Calendar size={12} /> {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {movie.showTime && (
                        <span className="movie-list-card__meta-item movie-list-card__meta-item--blue">
                          <Clock size={12} /> {movie.showTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="movie-list-card__actions">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="movie-list-card__btn movie-list-card__btn--edit"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(movie)}
                    className="movie-list-card__btn movie-list-card__btn--delete"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && editingMovie && (
          <div className="movie-modal__overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="movie-modal__backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="movie-modal"
            >
              <div className="movie-modal__header">
                <div className="movie-modal__header-content">
                  <div className="movie-modal__icon-badge">
                    <Clapperboard size={24} />
                  </div>
                  <h2 className="movie-modal__title">
                    Edit <span className="movie-modal__title--accent">Metadata</span>
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="movie-modal__close"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="movie-modal__content">
                <div className="movie-modal__grid">
                  <div className="movie-modal__poster-section">
                    <img
                      src={getImageUrl(
                        editingMovie.posterUrl || editingMovie.imageUrl,
                      )}
                      className="movie-modal__poster"
                      alt="Poster"
                    />
                  </div>

                  <div className="movie-modal__form-fields">
                    <div className="movie-modal__form-field movie-modal__form-field--full">
                      <label className="movie-modal__label">Title</label>
                      <input
                        type="text"
                        value={editingMovie.title}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            title: e.target.value,
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field movie-modal__form-field--full">
                      <label className="movie-modal__label">Description</label>
                      <textarea
                        rows={3}
                        value={editingMovie.description}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            description: e.target.value,
                          })
                        }
                        className="movie-modal__textarea"
                      />
                    </div>

                    <div className="movie-modal__form-field">
                      <label className="movie-modal__label">Assigned Hall</label>
                      <select
                        value={editingMovie.cinema || ""}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            cinema: e.target.value,
                          })
                        }
                        className="movie-modal__select"
                      >
                        <option value="" disabled>
                          Select a Hall
                        </option>
                        {cinemas.map((hall) => (
                          <option key={hall._id} value={hall._id}>
                            Hall #{hall.numbering} ({hall.seats?.length || 0} Seats)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="movie-modal__form-field">
                      <label className="movie-modal__label">Genre</label>
                      <input
                        type="text"
                        value={editingMovie.genre}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            genre: e.target.value,
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field">
                      <label className="movie-modal__label">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingMovie.rating}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            rating: Number(e.target.value),
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field">
                      <label className="movie-modal__label">Ticket Price (AMD)</label>
                      <input
                        type="number"
                        value={editingMovie.price}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            price: Number(e.target.value),
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field">
                      <label className="movie-modal__label">Release Date</label>
                      <input
                        type="date"
                        value={editingMovie.releaseDate ? new Date(editingMovie.releaseDate).toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            releaseDate: new Date(e.target.value).toISOString(),
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field">
                      <label className="movie-modal__label">Show Time</label>
                      <input
                        type="time"
                        value={editingMovie.showTime || ''}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            showTime: e.target.value,
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field movie-modal__form-field--full">
                      <label className="movie-modal__label">Poster URL</label>
                      <input
                        type="text"
                        value={editingMovie.posterUrl || ""}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            posterUrl: e.target.value,
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>

                    <div className="movie-modal__form-field movie-modal__form-field--full">
                      <label className="movie-modal__label">Trailer URL</label>
                      <input
                        type="text"
                        value={editingMovie.videoUrl || ""}
                        onChange={(e) =>
                          setEditingMovie({
                            ...editingMovie,
                            videoUrl: e.target.value,
                          })
                        }
                        className="movie-modal__input"
                      />
                    </div>
                  </div>
                </div>

                <div className="movie-modal__actions">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="movie-modal__btn movie-modal__btn--cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="movie-modal__btn movie-modal__btn--save"
                  >
                    <Save size={18} />
                    {loading ? "thynking..." : "Save changes"}
                  </button>
                  </div>
                </form>
              </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && movieToDelete && (
          <div className="delete-modal__overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="delete-modal__backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="delete-modal"
            >
              <div className="delete-modal__content">
                <div className="delete-modal__icon-wrap">
                  <AlertCircle size={32} />
                </div>
                <h3 className="delete-modal__title">Remove Title?</h3>
                <p className="delete-modal__description">
                  Are you sure you want to remove <strong>{movieToDelete.title}</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="delete-modal__actions">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="delete-modal__btn delete-modal__btn--cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={loading}
                  className="delete-modal__btn delete-modal__btn--delete"
                >
                  {loading ? "Removing..." : "Remove"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieList;
