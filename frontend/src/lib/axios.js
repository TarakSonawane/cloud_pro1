import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://backend-cloud-project-d7bjbkd3fhd3ajbc.canadacentral-01.azurewebsites.net/api",
  withCredentials: true,
});
