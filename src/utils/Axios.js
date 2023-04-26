import axios from "axios";
import { baseUrl } from "./constant";

const Axios = axios.create({
    baseURL: baseUrl
});

Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response;
        } else {
            return Promise.reject({ message: "No response received from server" });
        }
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/";
        } else {
            return Promise.reject({ message: "Something went wrong" });
        }
    }
);

export default Axios;
