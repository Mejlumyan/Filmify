import { Axios } from "../config/axios";

export const movieService = {
  getAllMovies: async () => {
    const res = await Axios.get("/movie");
    return res;
  },

  getMovieById: async (id) => {
    const res = await Axios.get(`/movie/${id}`);
    return res;
  },

  addMovie: async (data) => {
    const res = await Axios.post("/movie/add-movie", data);
    return res;
  },

  deleteMovie: async (id) => {
    const res = await Axios.delete(`/movie/${id}`);
    return res;
  },

  updateMovie: async (id, data) => {
    const res = await Axios.patch(`/movie/${id}`, data);
    return res;
  },

  getMovieTrailer: async (id) => {
    const res = await Axios.get(`/movie/${id}/trailer`);
    return res;
  },

  searchMovie: async (title) => {
    const res = await Axios.get(`/movie/search/${title}`);
    return res;
  },

  getMovieByMovieId: async (movieId) => {
    const res = await Axios.get(`/movies/${movieId}`);
    return res;
  },
};
