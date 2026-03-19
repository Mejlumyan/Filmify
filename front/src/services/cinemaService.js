import { Axios } from "../config/axios";

export const cinemaService = {
  getAllCinemas: async () => {
    const res = await Axios.get("/cinema");
    return res;
  },

  getCinemaByIdWithMovie: async (cinemaId, movieId) => {
    const res = await Axios.get(`/cinema/${cinemaId}?movieId=${movieId}`);
    return res;
  },

  createCinema: async (data) => {
    const res = await Axios.post("/cinema/create", data);
    return res;
  },
};
