import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8088",
});

export default api;

/*mport axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.15:8088",
});

export default api;*/