import "./Footer.scss";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail,
  Facebook,
  Twitter,
  Instagram
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <motion.div 
          className="footer__container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="footer__section" variants={itemVariants}>
            <h3 className="footer__title">About Filmify</h3>
            <p className="footer__text">
              Filmify is your ultimate destination for premium cinema experiences. 
              We bring the magic of movies to life with cutting-edge technology 
              and world-class customer service.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div className="footer__section" variants={itemVariants}>
            <h3 className="footer__title">Our Location</h3>
            <div className="footer__contact-item">
              <div className="footer__contact-icon">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="footer__contact-label">Main Office</p>
                <p className="footer__contact-text">
                  123 Cinema Street<br />
                  Yerevan, Secret for now<br />
                  Armenia
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="footer__section" variants={itemVariants}>
            <h3 className="footer__title">Contact Us</h3>
            <div className="footer__contact-item">
              <div className="footer__contact-icon">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="footer__contact-label">Phone</p>
                <a href="tel:+37491290229" className="footer__contact-link">
                  +374 (91) 290229
                </a>
              </div>
            </div>
            <div className="footer__contact-item">
              <div className="footer__contact-icon">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="footer__contact-label">Email</p>
                <a href="mailto:gmejlumyan93@gmail.com" className="footer__contact-link">
                  gmejlumyan93@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div className="footer__section" variants={itemVariants}>
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__links">
              <li>
                <a href="/" className="footer__link">Home</a>
              </li>
              <li>
                <a href="/movies" className="footer__link">Movies</a>
              </li>
              {/* <li>
                <a href="#" className="footer__link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="footer__link">Terms & Conditions</a>
              </li> */}
            </ul>
          </motion.div>
        </motion.div>

        <div className="footer__divider" />

        <motion.div 
          className="footer__bottom"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="footer__copyright">
            &copy; {currentYear} Filmify. All rights reserved.
          </p>
          <p className="footer__credit">
            Crafted with <span className="footer__heart">❤</span> for cinema lovers worldwide
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
