import "./add-movie.scss";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { movieService } from "../../services/movieService";
import { cinemaService } from "../../services/cinemaService";
import {
  FilmIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HandThumbUpIcon,
  CalendarDaysIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  CloudArrowUpIcon,
  SparklesIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

registerLocale("en", enUS);
export const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    rating: "",
    cinemaId: "",
    price: "",
    releaseDate: "",
    showTime: "",
  });

  const [cinemas, setCinemas] = useState([]);
  const [isCinemasLoading, setIsCinemasLoading] = useState(true);
  const [previews, setPreviews] = useState({ poster: "", banner: "" });
  const [files, setFiles] = useState({ poster: null, banner: null, video: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCinemas = async () => {
      setIsCinemasLoading(true);
      try {
        const res = await cinemaService.getAllCinemas();
        const actualData = res.data.data || res.data;
        setCinemas(Array.isArray(actualData) ? actualData : []);
      } catch (err) {
      } finally {
        setIsCinemasLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      if (type !== "video") {
        setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cinemaId || formData.cinemaId === "") {
      return alert("Please select a cinema hall");
    }

    setIsSubmitting(true);
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("genre", formData.genre);
    data.append("rating", formData.rating || "0");
    data.append("price", formData.price || "0");
    data.append("cinema", formData.cinemaId);

    const releaseDateTime = formData.releaseDate && formData.showTime 
      ? new Date(`${formData.releaseDate}T${formData.showTime}`)
      : new Date();
    data.append("releaseDate", releaseDateTime.toISOString());
    data.append("showTime", formData.showTime || "00:00");
    data.append("duration", "120");

    if (files.poster) data.append("posterUrl", files.poster);
    if (files.banner) data.append("imageUrl", files.banner);
    if (files.video) data.append("videoUrl", files.video);

    try {
      await movieService.addMovie(data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Movie published successfully");
    } catch (err) {
      console.error("Upload error", err.response?.data || err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-movie-page">
      <div className="add-movie-inner">
        <div className="add-movie-header">
          <div className="add-movie-header__glow" />
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="add-movie-header__title"
          >
            Add New Movie
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="add-movie-header__sub"
          >
            Add a New Story to the Screen
          </motion.p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="add-movie-layout"
        >
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="add-movie-form-card"
          >
            <div className="add-movie-form-section">
              <SectionHeader title="Core Details" />
              <div className="add-movie-form-fields">
                <FloatingInput
                  label="Film Title"
                  placeholder="Enter movie name..."
                  icon={<FilmIcon className="w-5 h-5" />}
                  onChange={(val) =>
                    setFormData({ ...formData, title: val })
                  }
                />

                <div className="form-field">
                  <div className="form-field__glow" />
                  <div className="form-field__inner">
                    <div className="form-field__icon-wrap">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <div className="form-field-select-wrap">
                      <label className="form-field__label">Select a cinema hall</label>
                      <select
                        value={formData.cinemaId}
                        onChange={(e) =>
                          setFormData({ ...formData, cinemaId: e.target.value })
                        }
                        className="form-field__select"
                        disabled={isCinemasLoading}
                      >
                        <option value="">
                          {isCinemasLoading ? "Loading" : "Select a hall"}
                        </option>
                        {cinemas.map((c) => (
                          <option key={c._id} value={c._id}>
                            Hall #{c.numbering}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="add-movie-form-fields">
                  <FloatingInput
                    label="Primary Genre"
                    placeholder="Sci-Fi Adventure"
                    icon={<PencilSquareIcon className="w-5 h-5" />}
                    onChange={(val) =>
                      setFormData({ ...formData, genre: val })
                    }
                  />
                  <FloatingInput
                    label="Price"
                    placeholder="$15.00"
                    type="number"
                    icon={<CurrencyDollarIcon className="w-5 h-5" />}
                    onChange={(val) =>
                      setFormData({ ...formData, price: val })
                    }
                  />
                  <FloatingInput
                    label="Internal Rating"
                    placeholder="PG-13"
                    type="number"
                    icon={<HandThumbUpIcon className="w-5 h-5" />}
                    onChange={(val) =>
                      setFormData({ ...formData, rating: val })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="add-movie-form-section">
              <SectionHeader title="Schedule" />
              <div className="add-movie-schedule-grid">
                <div className="schedule-card">
                  <div className="schedule-card__icon">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div className="schedule-card__content">
                    <label className="schedule-card__label">Release Date</label>
                  </div>
                  <DatePicker
                    selected={formData.releaseDate ? new Date(formData.releaseDate + 'T00:00:00') : null}
                    onChange={(date) => {
                      if (date) {
                        const isoDate = date.toISOString().split('T')[0];
                        setFormData({ ...formData, releaseDate: isoDate });
                      }
                    }}
                    dateFormat="MMMM d, yyyy"
                    locale="en"
                    minDate={new Date()}
                    className="schedule-card__input"
                    placeholderText="Select release date"
                    withPortal
                    portalId="datepicker-portal"
                  />
                  {formData.releaseDate && (
                    <div className="schedule-card__preview">
                      {new Date(formData.releaseDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </div>

                <div className="schedule-card schedule-card--time">
                  <div className="schedule-card__icon schedule-card__icon--time">
                    <BellAlertIcon className="w-6 h-6" />
                  </div>
                  <div className="schedule-card__content">
                    <label className="schedule-card__label">Show Time</label>
                  </div>
                  <DatePicker
                    selected={formData.showTime ? new Date(`2000-01-01T${formData.showTime}`) : null}
                    onChange={(date) => {
                      if (date) {
                        const time = date.toTimeString().slice(0, 5);
                        setFormData({ ...formData, showTime: time });
                      }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    locale="en"
                    className="schedule-card__input"
                    placeholderText="Select show time"
                    withPortal
                    portalId="timepicker-portal"
                  />
                  {formData.showTime && (
                    <div className="schedule-card__preview">
                       {formData.showTime}
                    </div>
                  )}
                </div>
              </div>

              {formData.releaseDate && formData.showTime && (
                <div className="schedule-success">
                  <div className="schedule-success__icon">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="schedule-success__content">
                    <h3 className="schedule-success__title">Scheduled Successfully!</h3>
                    <p className="schedule-success__date">
                      {new Date(formData.releaseDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })} at {formData.showTime}
                    </p>
                  </div>
                  <div className="schedule-success__meta">
                    <p className="schedule-success__status">Ready to premiere</p>
                    <p className="schedule-success__hint">Cinema management</p>
                  </div>
                </div>
              )}
            </div>

          
            <div className="add-movie-form-section">
              <SectionHeader title="Add trailer" />
              <div className="video-upload-area">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="video-upload-area__input"
                />
                <div className={`video-upload-area__content ${files.video ? 'video-upload-area__content--active' : ''}`}>
                  <div className="video-upload-area__icon">
                    <PlayCircleIcon className="w-8 h-8" />
                  </div>
                  <div className="video-upload-area__text">
                    <p className="video-upload-area__label">Trailer Upload</p>
                    <p className="video-upload-area__file">
                      {files.video ? files.video.name : "There is no trailer uploaded yet. Click to select a video file."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="add-movie-form-section">
              <SectionHeader title="About film"/>
              <div className="form-textarea-wrapper">
                <textarea
                  placeholder="Add a description for the movie"
                  className="form-field__textarea"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="add-movie-sidebar"
          >
            <div className="add-movie-form-section">
              <SectionHeader title="Movie Poster"/>
              <div className="add-movie-form-fields">
                <AssetUpload
                  label="Upload a poster image"
                  aspect="poster"
                  preview={previews.poster}
                  onChange={(e) => handleFileChange(e, "poster")}
                />
                <AssetUpload
                  label="Upload a  banner"
                  aspect="banner"
                  preview={previews.banner}
                  onChange={(e) => handleFileChange(e, "banner")}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="add-movie-submit-btn"
            >
              <CheckCircleIcon
                className={`add-movie-submit-btn__icon ${
                  isSubmitting ? "add-movie-submit-btn__icon--loading" : ""
                }`}
              />
              <span className="add-movie-submit-btn__text">
                {isSubmitting ? "syncing" : "Add movie"}
              </span>
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};


const SectionHeader = ({ title}) => (
  <div className="form-section-title">
    <div className="form-section-title__line" />
    <h3 className="form-section-title__text">{title}</h3>
  </div>
);

const FloatingInput = ({
  label,
  icon,
  placeholder,
  type = "text",
  onChange,
}) => (
  <div className="form-field">
    <div className="form-field__glow" />
    <div className="form-field__inner">
      <div className="form-field__icon-wrap">
        {icon}
      </div>
      <div className="form-field-input-wrap">
        <label className="form-field__label">{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="form-field__input"
        />
      </div>
    </div>
  </div>
);

const AssetUpload = ({ label, aspect, preview, onChange }) => (
  <div className={`asset-upload asset-upload--${aspect}`}>
    <AnimatePresence mode="wait">
      {preview ? (
        <motion.img
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={preview}
          className="asset-upload__image"
        />
      ) : (
        <div className="asset-upload__placeholder">
          <div className="asset-upload__icon">
            <CloudArrowUpIcon className="w-8 h-8" />
          </div>
          <p className="asset-upload__label">{label}</p>
        </div>
      )}
    </AnimatePresence>
    <input
      type="file"
      onChange={onChange}
      className="asset-upload__input"
    />
  </div>
);
