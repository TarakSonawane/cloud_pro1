import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://cloudseperatebackend-aagjfqfxgqffbwh9.canadacentral-01.azurewebsites.net/api",
  withCredentials: true,
});
