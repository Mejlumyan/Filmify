import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

import "./NotFound.scss";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__content">
          <div className="not-found__code">404</div>
          
          <h1 className="not-found__title">Page Not Found</h1>
          
          <p className="not-found__subtitle">
            Sorry, we couldn't find the page you're looking for. It might have been removed or the URL might be incorrect.
          </p>

          <div className="not-found__actions">
            <button
              onClick={() => navigate("/")}
              className="not-found__btn not-found__btn--primary"
            >
              <Home size={18} />
              Go to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="not-found__btn not-found__btn--secondary"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>

        <div className="not-found__decoration">
          <div className="not-found__shape not-found__shape--1"></div>
          <div className="not-found__shape not-found__shape--2"></div>
          <div className="not-found__shape not-found__shape--3"></div>
        </div>
      </div>
    </div>
  );
};
