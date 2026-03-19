import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cinemaService } from "../../../services/cinemaService";
import { movieService } from "../../../services/movieService";
import { paymentService } from "../../../services/paymentService";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Ticket,
  Sparkles,
  MoveRight,
  Armchair,
  X,
  Wallet,
  Lock,
  CreditCard,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { CreditCardForm } from "../../components/CreditCardForm";
import "./Booking.scss";

export const Booking = () => {
  const { cinemaId, id } = useParams();
  const navigate = useNavigate();

  const [cinema, setCinema] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
  const [showTopUp, setShowTopUp] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!cinemaId || !id || id === "undefined") return;

        const [cinemaRes, movieRes] = await Promise.all([
          cinemaService.getCinemaByIdWithMovie(cinemaId, id),
          movieService.getMovieById(id),
        ]);

        const cinemaData = cinemaRes.data.data || cinemaRes.data;
        setCinema(cinemaData);
        setMovie(movieRes.data.data || movieRes.data);

        if (cinemaData?.seats?.length > 0) {
          const max_x = Math.max(...cinemaData.seats.map((s) => s.x));
          const max_y = Math.max(...cinemaData.seats.map((s) => s.y));
          setGridSize({ cols: max_x + 1, rows: max_y + 1 });
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cinemaId, id]);

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.find((s) => s._id === seat._id)
        ? prev.filter((s) => s._id !== seat._id)
        : [...prev, seat],
    );
  };

  const totalPrice = selectedSeats.reduce((acc, seat) => {
    const basePrice = Number(movie?.price) || 0;
    if (seat.types === "VIP") return acc + basePrice * 2.5;
    if (seat.types === "MEDIUM") return acc + basePrice * 1.5;
    return acc + basePrice;
  }, 0);

  const handleConfirmOrder = async (useStripe = false) => {
    if (selectedSeats.length === 0) return;
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Please log in to continue");
        return navigate("/login");
      }
      const user = JSON.parse(userStr);

      if (!useStripe && user.balance < totalPrice) {
        toast.error("Insufficient balance");
        setShowTopUp(true);
        return;
      }

      if (useStripe) {
        setShowStripePayment(true);
        return;
      }

      setIsProcessing(true);

      const response = await paymentService.processPayment({
        userId: user._id || user.id,
        cinemaId: cinemaId,
        movieId: id,
        selectedSeats: selectedSeats,
        totalPrice: totalPrice,
      });

      if (response.data.success) {
        user.balance -= totalPrice;
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));

        toast.success("Booking successful!");
        navigate("/profile/payments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const movieTitleKey = movie?.title
    ? `movies_data.${movie.title.toLowerCase().replace(/ /g, "_")}_title`
    : "";

  const handleStripePaymentSuccess = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);

      setIsProcessing(true);

      const response = await paymentService.processPayment({
        userId: user._id || user.id,
        cinemaId: cinemaId,
        movieId: id,
        selectedSeats: selectedSeats,
        totalPrice: totalPrice,
        paymentMethod: "stripe",
      });

      if (response.data.success) {
        user.balance -= totalPrice;
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));

        setShowStripePayment(false);
        toast.success("Booking successful!");
        navigate("/profile/payments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="booking-loading">
        <div className="booking-loading__spinner" />
      </div>
    );

  return (
    <div className="booking-page">
      <div className="booking-bg-glow">
        <div className="booking-bg-glow__blob" />
      </div>

      <header className="booking-header">
        <button
          onClick={() => navigate(-1)}
          className="booking-back-btn"
        >
          <ChevronLeft size={20} className="booking-back-btn__icon" />
          <span className="booking-back-btn__label">
            Back
          </span>
        </button>
        <div className="booking-title-area">
          <p className="booking-movie-label">
            {movie?.title}
          </p>
          <h1 className="booking-hall-title">
            Hall{" "}
            <span className="booking-hall-title__number">#{cinema?.numbering}</span>
          </h1>
        </div>
      </header>

      <main className="booking-main">
        <div className="booking-screen-wrap">
          <div className="booking-screen-bar" />
          <p className="booking-screen-text">
            Screen
          </p>
        </div>

        <div
          className="booking-seats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize.cols}, 55px)`,
            gap: "15px",
          }}
        >
          {cinema?.seats?.map((seat) => {
            const isSelected = selectedSeats.some((s) => s._id === seat._id);
            const isBooked = seat.isBooked;

            let seatClass = "seat-btn";
            if (isBooked) {
              seatClass += " seat-btn--booked";
            } else if (isSelected) {
              seatClass += " seat-btn--selected";
            } else if (seat.types === "VIP") {
              seatClass += " seat-btn--vip";
            } else if (seat.types === "MEDIUM") {
              seatClass += " seat-btn--medium";
            } else {
              seatClass += " seat-btn--available";
            }

            return (
              <button
                key={seat._id}
                disabled={isBooked}
                onClick={() => toggleSeat(seat)}
                style={{
                  gridColumnStart: seat.x + 1,
                  gridRowStart: seat.y + 1,
                }}
                className={seatClass}
              >
                {!isBooked ? (
                  <span className="seat-btn__label">
                    {seat.numbering}
                  </span>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="seat-btn__taken"
                  >
                    <Lock size={14} className="seat-btn__taken-lock" />
                    <span className="seat-btn__taken-text">
                      "Taken"
                    </span>
                  </motion.div>
                )}
                {seat.types === "VIP" && !isBooked && !isSelected && (
                  <Sparkles
                    size={8}
                    className="seat-btn__vip-sparkle"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="booking-legend">
          {[
            { label: "VIP",       type: "vip" },
            { label: "Medium",    type: "medium" },
            { label: "Available", type: "available" },
            {
              label: "Booked",
              type: "booked",
              icon: <Lock size={10} className="legend-dot__lock" />,
            },
          ].map((item, i) => (
            <div key={i} className="legend-item">
              <div className={`legend-dot legend-dot--${item.type}`}>
                {item.icon}
              </div>
              <span className={`legend-label legend-label--${item.type}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {showTopUp && (
          <div className="topup-modal-overlay">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="topup-modal"
            >
              <button
                onClick={() => setShowTopUp(false)}
                className="topup-modal__close"
              >
                <X size={24} />
              </button>
              <div className="topup-modal__header">
                <div className="topup-modal__icon">
                  <Wallet size={28} />
                </div>
                <h3 className="topup-modal__title">
                  "Balance Top-up"
                </h3>
              </div>
              <CreditCardForm onSuccess={() => setShowTopUp(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStripePayment && (
          <div className="stripe-modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="stripe-modal"
            >
              <button
                onClick={() => setShowStripePayment(false)}
                className="stripe-modal__close"
              >
                <X size={24} />
              </button>
              <div className="stripe-modal__header">
                <div className="stripe-modal__icon">
                  <CreditCard size={32} />
                </div>
                <h3 className="stripe-modal__title">
                  Secure Payment
                </h3>
                <p className="stripe-modal__subtitle">
                  Complete your booking with Stripe
                </p>
              </div>
              <div className="stripe-modal__content">
                <div className="stripe-test-card-info">
                  <p className="stripe-test-card-info__label">Test Card (Use this to test):</p>
                  <div className="stripe-test-card-info__card">
                    <p>Card Number: <strong>4242 4242 4242 4242</strong></p>
                    <p>Expiry: <strong>Any future date</strong></p>
                    <p>CVC: <strong>Any 3 digits</strong></p>
                  </div>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleStripePaymentSuccess();
                }} className="stripe-test-form">
                  <div className="stripe-field">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      defaultValue="4242 4242 4242 4242"
                      readOnly
                      className="stripe-field__input"
                    />
                  </div>
                  <div className="stripe-field-row">
                    <div className="stripe-field">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        defaultValue="12/25"
                        readOnly
                        className="stripe-field__input"
                      />
                    </div>
                    <div className="stripe-field">
                      <label>CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        defaultValue="123"
                        readOnly
                        className="stripe-field__input"
                      />
                    </div>
                  </div>
                  <div className="stripe-amount-summary">
                    <p className="stripe-amount-summary__label">Total Amount</p>
                    <p className="stripe-amount-summary__value">
                      {totalPrice.toLocaleString()} AMD
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="stripe-submit-btn"
                  >
                    {isProcessing ? "Processing..." : `Pay ${totalPrice} AMD`}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 150, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            className="checkout-bar"
          >
            <div className="checkout-inner">
              <div className="checkout-info">
                <div className="checkout-stat">
                  <div className="checkout-stat__icon checkout-stat__icon--seats">
                    <Armchair size={28} />
                  </div>
                  <div>
                    <p className="checkout-stat__label">Seats</p>
                    <p className="checkout-stat__value">{selectedSeats.length}</p>
                  </div>
                </div>
                <div className="checkout-stat">
                  <div className="checkout-stat__icon checkout-stat__icon--total">
                    <Ticket size={28} />
                  </div>
                  <div>
                    <p className="checkout-stat__label">Total Price</p>
                    <p className="checkout-stat__value">
                      {totalPrice.toLocaleString()}{" "}
                      <span className="checkout-stat__currency">
                        AMD
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleConfirmOrder(false)}
                disabled={isProcessing}
                className="checkout-confirm-btn checkout-confirm-btn--balance"
              >
                {isProcessing ? "Processing..." : "Book with Balance"} <MoveRight />
              </button>
              <button
                onClick={() => handleConfirmOrder(true)}
                disabled={isProcessing}
                className="checkout-confirm-btn checkout-confirm-btn--stripe"
              >
                <CreditCard size={18} />
                {isProcessing ? "Processing..." : "Book with Card"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
