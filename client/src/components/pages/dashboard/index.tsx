import { Box, Container, Grid, Title } from "@mantine/core";
import { useContext, useEffect } from "react";
import DocumentTitleContext from "../../../contexts/DocumentTitleProvider";
import useAuth from "../../../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import RecorderDashboard from "./RecorderDashboard";

const Dashboard = () => {
  const { setTitle } = useContext(DocumentTitleContext);

  const { auth } = useAuth();

  useEffect(() => {
    setTitle((prev: any) => ({ ...prev, pageTitle: "Dashboard" }));
  }, []);

  return (
    <>
      <Container fluid px={0}>
        <Box>
          <Title order={1} sx={{ fontWeight: 400, color: "gray" }} mb={40}>
            Dashboard
          </Title>
        </Box>
        {auth.userRole === "admin" && <AdminDashboard />}
        {(auth.userRole === "recorder" ||
          auth.userRole === "team-leader" ||
          auth.userRole === "inspector") && <RecorderDashboard />}
      </Container>
    </>
  );
};

export default Dashboard;
