import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainScroll = document.querySelector(".cinema-main__scroll");
      if (mainScroll) {
        mainScroll.scrollTo({ top: 0, behavior: "smooth" });
      }
      
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
