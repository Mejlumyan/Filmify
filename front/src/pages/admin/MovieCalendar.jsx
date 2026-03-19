import "./MovieCalendar.scss";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { cinemaService } from "../../services/cinemaService";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  FilmIcon,
  StarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { API_URL } from "../../config/axios";

const MovieCalendar = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, cinemasRes] = await Promise.all([
        movieService.getAllMovies(),
        cinemaService.getAllCinemas()
      ]);

      const moviesData = moviesRes.data.data || moviesRes.data;
      const cinemasData = cinemasRes.data.data || cinemasRes.data;

      const moviesWithCinemaNames = moviesData.map((movie) => {
        const cinema = cinemasData.find((c) => c._id === movie.cinema);
        return {
          ...movie,
          cinemaName: cinema?.name || `Hall ${cinema?.numbering}`,
          cinemaNumbering: cinema?.numbering
        };
      });

      setMovies(Array.isArray(moviesWithCinemaNames) ? moviesWithCinemaNames : []);
      setCinemas(Array.isArray(cinemasData) ? cinemasData : []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getMoviesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return movies.filter(movie => {
      const movieDate = new Date(movie.releaseDate).toISOString().split('T')[0];
      return movieDate === dateStr;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace("/not/", "/");
    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${API_URL}${finalPath}`;
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleBuyTicket = (movie) => {
    navigate(`/cinema/${movie.cinema}/${movie._id}`);
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMoviesGroupedByDate = () => {
    const grouped = {};
    movies.forEach(movie => {
      const dateStr = new Date(movie.releaseDate).toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(movie);
    });
    
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, moviesList]) => ({
        date,
        movies: moviesList.sort((a, b) => a.showTime.localeCompare(b.showTime))
      }));
  };

  if (loading) {
    return (
      <div className="movie-calendar-page">
        <div className="movie-calendar-inner">
          <div className="movie-calendar-loading">
            <div className="movie-calendar-spinner"></div>
            <p className="movie-calendar-loading-text">Loading cinema schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-calendar-page">
      <div className="movie-calendar-inner">
        <div className="movie-calendar-header">
          <div className="movie-calendar-header__glow" />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="movie-calendar-header__title"
          >
            Cinema <span style={{ color: '#f5f505' }}>Schedule</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="movie-calendar-header__sub"
          >
            View movie screenings {viewMode === 'calendar' ? 'by date' : 'as a list'}
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="movie-calendar-container"
        >
          <div className="movie-view-toggle">
            <button
              onClick={() => setViewMode('calendar')}
              className={`movie-view-btn ${viewMode === 'calendar' ? 'movie-view-btn--active' : ''}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2h2V4a3 3 0 00-3-3H4a3 3 0 00-3 3v16a3 3 0 003 3h16a3 3 0 003-3v-2h-2v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm16 4h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zM3 8h2v2H3V8zm0 4h2v2H3v-2zm0 4h2v2H3v-2z"/>
              </svg>
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`movie-view-btn ${viewMode === 'list' ? 'movie-view-btn--active' : ''}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              List
            </button>
          </div>

          {viewMode === 'calendar' ? (
            <>
              <div className="movie-calendar-controls">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMonth('prev')}
                  className="movie-calendar-button"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </motion.button>

                <h2 className="movie-calendar-month">{monthYear}</h2>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMonth('next')}
                  className="movie-calendar-button"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="movie-calendar-weekdays">
                {weekDays.map(day => (
                  <div key={day} className="movie-calendar-weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="movie-calendar-days">
                {getDaysInMonth(currentDate).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="movie-calendar-day-empty"></div>;
                  }

                  const dayMovies = getMoviesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <motion.div
                      key={date.toISOString()}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      className={`movie-calendar-day ${isToday ? 'movie-calendar-day--today' : ''} ${dayMovies.length > 0 ? 'movie-calendar-day--has-movies' : ''}`}
                    >
                      {dayMovies.length > 0 ? (
                        dayMovies.slice(0, 1).map((movie) => (
                          <div
                            key={movie._id}
                            className="movie-calendar-day-movie"
                            onClick={() => handleMovieClick(movie)}
                          >
                            <img
                              src={getImageUrl(movie.posterUrl || movie.imageUrl || '')}
                              alt={movie.title}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-movie.jpg';
                              }}
                            />
                            <div className="movie-calendar-day-overlay">
                              <div className="movie-calendar-day-header">
                                <div className="movie-calendar-day-date">
                                  {date.getDate()}
                                </div>
                              </div>
                              <div className="movie-calendar-day-info">
                                <div className="movie-calendar-day-title">
                                  {movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title}
                                </div>
                                <div className="movie-calendar-day-meta">
                                  <MapPinIcon className="w-3 h-3" />
                                  <span>#{movie.cinemaNumbering}</span>
                                  {movie.showTime && (
                                    <>
                                      <ClockIcon className="w-3 h-3 ml-1" />
                                      <span>{movie.showTime}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {dayMovies.length > 1 && (
                              <div className="movie-calendar-day-badge">
                                +{dayMovies.length - 1}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="movie-calendar-day-number">
                          {date.getDate()}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="movie-schedule-list">
              {getMoviesGroupedByDate().map(({ date, movies: dateMovies }) => (
                <div key={date} className="movie-schedule-day-group">
                  <div className="movie-schedule-day-header">
                    <h3 className="movie-schedule-day-date">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h3>
                    <span className="movie-schedule-count">{dateMovies.length} showing{dateMovies.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="movie-schedule-table">
                    <div className="movie-schedule-row movie-schedule-row--header">
                      <div className="movie-schedule-cell movie-schedule-cell--time">Time</div>
                      <div className="movie-schedule-cell movie-schedule-cell--title">Title</div>
                      <div className="movie-schedule-cell movie-schedule-cell--action-view">View</div>
                      <div className="movie-schedule-cell movie-schedule-cell--hall">Hall</div>
                      <div className="movie-schedule-cell movie-schedule-cell--rating">Rating</div>
                      <div className="movie-schedule-cell movie-schedule-cell--price">Price</div>
                      <div className="movie-schedule-cell movie-schedule-cell--action-book">Book</div>
                    </div>

                    {dateMovies.map((movie) => (
                      <div key={movie._id} className="movie-schedule-row">
                        <div className="movie-schedule-cell movie-schedule-cell--time">
                          <span className="movie-schedule-time">{movie.showTime}</span>
                        </div>
                        <div className="movie-schedule-cell movie-schedule-cell--title">
                          <span className="movie-schedule-title">{movie.title}</span>
                        </div>
                        <div className="movie-schedule-cell movie-schedule-cell--action-view">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMovieClick(movie)}
                            className="movie-schedule-view-btn"
                          >
                            View
                          </motion.button>
                        </div>
                        <div className="movie-schedule-cell movie-schedule-cell--hall">
                          <span className="movie-schedule-hall">Hall #{movie.cinemaNumbering}</span>
                        </div>
                        <div className="movie-schedule-cell movie-schedule-cell--rating">
                          <span className="movie-schedule-rating">{movie.rating}+</span>
                        </div>
                        <div className="movie-schedule-cell movie-schedule-cell--price">
                          <span className="movie-schedule-price">{movie.price} AMD</span>
                        </div>
                        <div className="movie-schedule-cell movie-schedule-cell--action-book">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleBuyTicket(movie)}
                            className="movie-schedule-book-btn"
                          >
                            Book Now
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedMovie && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="movie-modal-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 10000 }}
            >
              <div className="movie-modal-container">
                <div className="movie-modal-header">
                  <div className="movie-modal-header-content">
                    <div className="movie-modal-header-icon">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h2 className="movie-modal-header-title">
                      Film <span>Details</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="movie-modal-close-btn"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="movie-modal-body">
                  <div className="movie-modal-grid">
                    <div className="movie-modal-poster">
                      <img
                        src={getImageUrl(selectedMovie.posterUrl || selectedMovie.imageUrl || '')}
                        alt={selectedMovie.title}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-movie.jpg';
                        }}
                      />
                    </div>

                    <div className="movie-modal-content">
                      <div>
                        <h3 className="movie-modal-title">
                          {selectedMovie.title}
                        </h3>
                        <p className="movie-modal-description">
                          {selectedMovie.description}
                        </p>
                      </div>

                      <div className="movie-modal-info-grid">
                        <div className="movie-modal-info-item">
                          <label className="movie-modal-info-label">
                            <FilmIcon className="w-4 h-4" /> Genre
                          </label>
                          <div className="movie-modal-info-value">
                            {selectedMovie.genre}
                          </div>
                        </div>

                        <div className="movie-modal-info-item">
                          <label className="movie-modal-info-label">
                            <StarIcon className="w-4 h-4" /> Rating
                          </label>
                          <div className="movie-modal-info-value movie-modal-info-value--accent">
                            {selectedMovie.rating} / 10
                          </div>
                        </div>

                        <div className="movie-modal-info-item">
                          <label className="movie-modal-info-label">
                            <MapPinIcon className="w-4 h-4" /> Cinema Room
                          </label>
                          <div className="movie-modal-info-value">
                            {selectedMovie.cinemaName || `Hall ${selectedMovie.cinemaNumbering}`}
                          </div>
                        </div>

                        <div className="movie-modal-info-item">
                          <label className="movie-modal-info-label">
                            <CurrencyDollarIcon className="w-4 h-4" /> Ticket Price
                          </label>
                          <div className="movie-modal-info-value movie-modal-info-value--price">
                            {selectedMovie.price} AMD
                          </div>
                        </div>
                      </div>

                      <div className="movie-modal-info-grid">
                        <div className="movie-modal-info-item">
                          <label className="movie-modal-info-label">
                            <CalendarIcon className="w-4 h-4" /> Release Date
                          </label>
                          <div className="movie-modal-info-value movie-modal-info-value--date">
                            {selectedMovie.releaseDate ? new Date(selectedMovie.releaseDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'Not set'}
                          </div>
                        </div>

                        <div className="movie-modal-info-item">
                          <label className="movie-modal-info-label">
                            <ClockIcon className="w-4 h-4" /> Show Time
                          </label>
                          <div className="movie-modal-info-value movie-modal-info-value--time">
                            {selectedMovie.showTime || 'Not set'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="movie-modal-footer">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="movie-modal-button movie-modal-button--secondary"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyTicket(selectedMovie)}
                      className="movie-modal-button movie-modal-button--primary"
                    >
                      Buy Ticket
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieCalendar;
