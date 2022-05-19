import { Box, Button, Container, createStyles } from "@mantine/core";
import { Outlet } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  container: {
    paddingTop: theme.spacing.lg,
    height: "100vh",
    position: "relative",
    backgroundColor: theme.colors.blue,
  },

  footer: {
    position: "sticky",
    bottom: 0,
    padding: ".5rem 0",
    backgroundColor: theme.colors.gray[0],
    left: 0,
    right: 0,

    "@media print": {
      display: "none",
    },
  },
}));

function PrintLayout() {
  const { classes } = useStyles();

  return (
    // <Container className={classes.container}>
    <Outlet />

    // <Box className={classes.footer}>
    // </Box>
    // </Container>
  );
}

export default PrintLayout;
