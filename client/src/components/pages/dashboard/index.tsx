import { Box, Container, Grid, Title } from "@mantine/core";

const Dashboard = () => {
  return (
    <>
      <Container fluid px={0}>
        <Box>
          <Title order={1} sx={{ fontWeight: 400, color: "gray" }}>
            Dashboard
          </Title>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
