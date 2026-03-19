import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { movieService } from "../../../services/movieService";
import { paymentService } from "../../../services/paymentService";
import { API_URL } from "../../../config/axios";
import { Clock, CheckCircle2, Receipt, Wallet, Film } from "lucide-react";
import "./Payment.scss";

const getImageUrl = (path, isHeroBanner = false) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  let finalPath = path.startsWith("/") ? path : `/${path}`;
  if (isHeroBanner) {
    if (!finalPath.includes("/not/"))
      finalPath = finalPath.replace("/uploads/", "/uploads/not/");
  } else {
    finalPath = finalPath.replace("/not/", "/");
  }
  return `${API_URL}${finalPath}`;
};

export const PaymentItem = ({ tx, index }) => {
  const [movie, setMovie] = useState(
    tx.movie && typeof tx.movie === "object" ? tx.movie : null,
  );
  const isBooking = tx.amount < 0;

  useEffect(() => {
    const fetchMovieData = async () => {
      if (movie && movie.title) return;
      const movieId = tx.movie?._id || tx.movie;

      if (
        isBooking &&
        movieId &&
        typeof movieId === "string" &&
        movieId.length > 10
      ) {
        try {
          const res = await movieService.getMovieByMovieId(movieId);
          const movieData = res.data.data || res.data;
          setMovie(movieData);
        } catch (err) {
          console.error(`Error:`, err);
        }
      }
    };
    fetchMovieData();
  }, [tx.movie, isBooking, movie]);

  const getMovieTitle = () => {
    if (!movie) return isBooking ? "Cinema Booking" : "Wallet Top-up";
    return movie.title || "Unknown";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="payment-item"
    >
      <div
        className={`payment-item__accent-bar ${isBooking ? "payment-item__accent-bar--booking" : "payment-item__accent-bar--topup"}`}
      />

      <div className="payment-item__left">
        <div className="payment-item__poster-wrap">
          {movie?.posterUrl ? (
            <img
              src={getImageUrl(movie.posterUrl)}
              alt=""
              className="payment-item__poster"
            />
          ) : (
            <div className="payment-item__poster-placeholder">
              {isBooking ? (
                <Film className="payment-item__poster-placeholder-icon" size={28} />
              ) : (
                <Wallet className="payment-item__poster-placeholder-icon--topup" size={28} />
              )}
            </div>
          )}
        </div>

        <div className="payment-item__info">
          <div className="payment-item__title-row">
            <h3 className="payment-item__title">
              {getMovieTitle()}
            </h3>
            <span
              className={`payment-item__status-badge ${isBooking ? "payment-item__status-badge--booking" : "payment-item__status-badge--topup"}`}
            >
              {isBooking ? "Reserved" : "Verified"}
            </span>
          </div>

          <div className="payment-item__meta">
            <div className="payment-item__meta-clock">
              <Clock size={12} /> {new Date(tx.createdAt).toLocaleDateString()}
            </div>
            <span>Ref: {tx._id.slice(-6).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="payment-item__right">
        <p className={`payment-item__amount ${isBooking ? "payment-item__amount--booking" : "payment-item__amount--topup"}`}>
          {tx.amount > 0 ? "+" : ""}
          {tx.amount.toLocaleString()}
          <span className="payment-item__currency">AMD</span>
        </p>
        <div className="payment-item__success">
          <span className="payment-item__success-label">
            Success
          </span>
          <CheckCircle2 size={10} className="payment-item__success-icon" />
        </div>
      </div>
    </motion.div>
  );
};

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id || user.id;
        if (userId) {
          const res = await paymentService.getPaymentHistory(userId);
          setHistory(res.data.data || res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="payment-loading">
        <div className="payment-loading__spinner" />
      </div>
    );

  return (
    <div className="payment-page">
      <header className="payment-header">
        <div className="payment-header__billing-row">
          <Receipt className="payment-header__icon" size={24} />
          <span className="payment-header__billing-label">
            My Tickets
          </span>
        </div>
        <h2 className="payment-header__title">
          History <span className="payment-header__title-muted"></span>
        </h2>
      </header>

      <div className="payment-list">
        {history.length === 0 ? (
          <div className="payment-empty">
            No records found
          </div>
        ) : (
          history.map((tx, index) => (
            <PaymentItem key={tx._id} tx={tx} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
