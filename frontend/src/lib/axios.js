import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "backend-cloud-project-d7bjbkd3fhd3ajbc.canadacentral-01.azurewebsites.net/api",
  withCredentials: true,
});
