import React, { useState } from "react";
import { motion } from "framer-motion";
import { cinemaService } from "../../services/cinemaService";
import { Armchair, Building2, Check, Sofa } from "lucide-react";
import "./AddCinema.scss";

const FrontViewSeat = ({ type, isSelected, seatTypes }) => {
  const currentType = type ? seatTypes[type] : null;
  return (
    <div className="seat-item">
      {isSelected && currentType ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="seat-normal"
        >
          <div
            className="seat-backrest"
            style={{ backgroundColor: currentType.topColor }}
          />
          <div
            className="seat-base"
            style={{ backgroundColor: currentType.color }}
          >
            <div className="seat-armrest-left" style={{ backgroundColor: currentType.sideColor }} />
            <div className="seat-armrest-right" style={{ backgroundColor: currentType.sideColor }} />
          </div>
        </motion.div>
      ) : (
        <div className="seat-empty">
          <Armchair size={14} />
        </div>
      )}
    </div>
  );
};

export const AddCinema = () => {
  const [hallNumber, setHallNumber] = useState("");
  const [selectedType, setSelectedType] = useState("NORMAL");
  const [layout, setLayout] = useState({});
  const [loading, setLoading] = useState(false);

  const SEAT_TYPES = {
    NORMAL: {
      label: "Normal",
      color: "#64748b",
      topColor: "#78a1c4",
      sideColor: "#475569",
      swatchColor: "#64748b",
      priceMul: 1,
    },
    MEDIUM: {
      label: "Medium",
      color: "#f5f505",
      topColor: "#f5d505",
      sideColor: "#c4c404",
      swatchColor: "#f5f505",
      priceMul: 1.5,
    },
    VIP: {
      label: "VIP",
      color: "#a78bfa",
      topColor: "#c084fc",
      sideColor: "#8b5cf6",
      swatchColor: "#a78bfa",
      priceMul: 2.5,
    },
  };

  const rows = 10;
  const cols = 12;

  const toggleSeat = (r, c) => {
    const key = `${r}-${c}`;
    const newLayout = { ...layout };
    if (newLayout[key]) delete newLayout[key];
    else
      newLayout[key] = {
        row: r,
        col: c,
        type: selectedType,
        price: 2000 * SEAT_TYPES[selectedType].priceMul,
      };
    setLayout(newLayout);
  };

  const handleSave = async () => {
    if (!hallNumber) return alert("Choose a hall number");
    setLoading(true);
    try {
      const seatsArray = Object.values(layout).map((seat, index) => ({
        numbering: index + 1,
        price: Number(seat.price),
        types: seat.type,
        status: "available",
        x: seat.col,
        y: seat.row,
      }));
      await cinemaService.createCinema({
        numbering: Number(hallNumber),
        customSeats: seatsArray,
      });
      alert("New hall saved!");
      setLayout({});
    } catch (e) {
      alert("Something went wrong, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-cinema-page">
      <div className="add-cinema-layout">
        <div className="add-cinema-sidebar">
          <div className="add-cinema-card">
            <div className="add-cinema-card__header">
              <div className="add-cinema-card__icon-wrap">
                <Building2 className="add-cinema-card__icon" />
              </div>
              <h2 className="add-cinema-card__title">Add New Hall</h2>
            </div>
            <div className="add-cinema-controls">
              <div>
                <label className="hall-number-label">Hall Number</label>
                <input
                  type="number"
                  value={hallNumber}
                  onChange={(e) => setHallNumber(e.target.value)}
                  className="hall-number-input"
                  placeholder="A1"
                />
              </div>
              <div className="add-cinema-seat-types">
                {Object.keys(SEAT_TYPES).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`seat-type-btn${selectedType === type ? " seat-type-btn--active" : ""}`}
                  >
                    <div className="seat-type-btn__inner">
                      <div
                        className="seat-type-btn__color-swatch"
                        style={{ backgroundColor: SEAT_TYPES[type].swatchColor }}
                      />
                      <span className="seat-type-btn__label">{SEAT_TYPES[type].label}</span>
                    </div>
                    {selectedType === type && (
                      <Check size={16} className="seat-type-btn__check" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSave}
                disabled={loading}
                className="save-hall-btn"
              >
                {loading ? "Constructing..." : "Save Hall"}
              </button>
            </div>
          </div>
        </div>

        <div className="cinema-canvas">
          <div className="cinema-screen-wrap">
            <div className="cinema-screen-bar" />
            <p className="cinema-screen-text">"Screen"</p>
          </div>
          <div className="seat-grid">
            <div
              className="seat-grid__inner"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const seat = layout[key];
                  return (
                    <div key={key} onClick={() => toggleSeat(r, c)}>
                      <FrontViewSeat
                        type={seat?.type}
                        isSelected={!!seat}
                        seatTypes={SEAT_TYPES}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
