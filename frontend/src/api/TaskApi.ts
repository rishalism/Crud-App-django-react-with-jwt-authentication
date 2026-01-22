import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
});

API.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !error.config._retry) {
      console.log("Session expired. Please log in again.");
      if (window.location.pathname !== "/login") {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const response = await GetRefreshToken(refreshToken);
            localStorage.setItem("access_token", response.data.access);
            error.config.headers["Authorization"] =
              `Bearer ${response.data.access}`;
            error.config._retry = true;
            return API.request(error.config);
          } catch (err) {
            console.log(
              "Refresh token expired or invalid. Redirecting to login.",
            );
          }
        } else {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  },
);

export const getTasks = () => API.get("tasks/");
export const addTask = (data: { title: string; completed: boolean }) =>
  API.post("tasks/", data);
export const deleteTask = (id: string) => API.delete(`tasks/${id}/`);
export const updateTask = (
  id: string,
  data: { title: string; completed: boolean },
) => API.put(`tasks/${id}/`, data);

export const LoginUser = (username: string, password: string) =>
  API.post("token/", { username, password });

export const GetRefreshToken = (refresh: string) => {
  return API.post("token/refresh/", { refresh });
};

export const RegisterUser = (username: string, password: string) => {
  return API.post("register/", { username, password });
};
