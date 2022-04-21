import axios from "../../api/axios";

const AuthService = {
  // create token
  create: async (credentilas) => {
    try {
      const response = await axios.post("/auth", credentilas, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  },

  // delete token
  delete: async () => {
    try {
      const response = await axios.delete("/auth", {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  },
};

export default AuthService;
