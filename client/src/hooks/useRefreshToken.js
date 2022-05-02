import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/auth", { withCredentials: true });

    setAuth((prev) => {
      return {
        ...prev,
        token: response.data.token,
        userRole: response.data.userRole,
        username: response.data.username,
        user: response.data.user,
      };
    });
    return response.data.token;
  };

  return refresh;
};

export default useRefreshToken;
