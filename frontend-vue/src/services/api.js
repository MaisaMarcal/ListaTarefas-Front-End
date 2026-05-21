import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088", // ajuste para a URL do seu back-end
});

export default api;