import { Navigate, Outlet } from "react-router-dom";
import { Register } from "../pages/auth/register/Register";
import { Login } from "../pages/auth/login/Login";
import { CinemaLayout } from "../pages/CinemaLayout";
import { Admin } from "../pages/admin/Admin";
import { NotFound } from "../pages/404/NotFound";
import { Home } from "../pages/menu/Home";
import { AddMovie } from "../pages/admin/add-movie";
import { AddCinema } from "../pages/admin/AddCinema";
import { Movie } from "../pages/menu/movie/Movie";
import MovieList from "../pages/admin/MovieList";
import { Users } from "../pages/admin/AllUsersList";
import { Discover } from "../pages/menu/movie/Discover";
import { Booking } from "../pages/menu/movie/Booking";
import  PaymentHistory  from "../pages/menu/movie/Payment";
import MovieCalendar from "../pages/admin/MovieCalendar";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

export const routes = [
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <CinemaLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "movie/:id",
            element: <Movie />,
          },
          {
            path: "movies",
            element: <Discover />,
          },
          {
            path: "calendar",
            element: <MovieCalendar />,
          },
          {
            path: "profile/payments",  
            element: <PaymentHistory />,
          },
          {
            path: "cinema/:cinemaId/:id",
            element: <Booking />,
          },
          {
            path: "admin",
            element: <Admin />,
            children: [
              {
                path: "add-cinema",
                element: <AddCinema />,
              },
              {
                path: "add-movie",
                element: <AddMovie />,
              },
              {
                path: "list",
                element: <MovieList />,
              },
              {
                path: "get-users",
                element: <Users />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
