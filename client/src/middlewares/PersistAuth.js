import { Box, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

function PersistAuth() {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    !auth?.token ? verifyRefreshToken() : setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader variant="dots" />
        </Box>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default PersistAuth;
