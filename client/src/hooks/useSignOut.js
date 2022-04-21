import { useNavigate } from "react-router-dom";
import AuthService from "./services/AuthService";
import useAuth from "./useAuth";

const useSignOut = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await AuthService.delete();
      setAuth({});
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  return signOut;
};

export default useSignOut;
