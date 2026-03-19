import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { CARD_CONFIG, CardName } from "../../types/type";
import { getCardType } from "../../utils/utils";
import { Amex, CardIcon, MasterCard, Visa } from "./CustomIcons";
import "./Card.scss";

export const Card = ({ name, number, expiry, cvc, isCvcFocused }) => {
  const cardType = useMemo(() => getCardType(number, CARD_CONFIG), [number]);

  const cardLogo = useMemo(() => {
    switch (cardType) {
      case CardName.AMERICAN_EXPRESS:
        return <Amex />;
      case CardName.MASTERCARD:
        return <MasterCard />;
      case CardName.VISA:
        return <Visa />;
      default:
        return <CardIcon />;
    }
  }, [cardType]);

  return (
    <div className="credit-card">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isCvcFocused ? "back" : "front"}
          initial={{ rotateY: isCvcFocused ? -180 : 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: isCvcFocused ? 180 : -180, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="card-face"
          style={{ transformStyle: "preserve-3d" }}
        >
          {isCvcFocused ? (
            <div className="card-back">
              <div className="card-back__stripe" />
              <div className="card-back__cvc-area">
                <p className="card-back__cvc-label">CVC Code</p>
                <div className="card-back__cvc-box">
                  <p className="card-back__cvc-value">{cvc || "•••"}</p>
                </div>
              </div>
              <div className="card-back__footer">
                <div className="card-back__bar" />
                <div className="card-back__bar" />
              </div>
            </div>
          ) : (
            <div className="card-front">
              <div className="card-front__glow" />
              <div className="card-front__header">
                <div className="card-front__type-wrap">
                  <span className="card-front__type-label">Bank Card</span>
                  <div className="card-front__type-name">
                    {cardType || "Filmify"}
                  </div>
                </div>
                <div style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" }}>
                  {cardLogo}
                </div>
              </div>
              <div className="card-front__number">
                {number || "•••• •••• •••• ••••"}
              </div>
              <div className="card-front__footer">
                <div className="card-front__holder">
                  <p className="card-front__holder-label">Card Holder</p>
                  <p className="card-front__holder-name">
                    {name || "Your Name"}
                  </p>
                </div>
                <div className="card-front__expiry">
                  <p className="card-front__expiry-label">Expires</p>
                  <p className="card-front__expiry-value">
                    {expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
