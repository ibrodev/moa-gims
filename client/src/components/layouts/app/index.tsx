import React, { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Image,
  Box,
  Title,
  Button,
} from "@mantine/core";
import MyNavbar from "../../navbar";
import MoaLogo from "../../../images/moa-logo.png";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Logout } from "tabler-icons-react";
import useSignOut from "../../../hooks/useSignOut";

export default function AppLayout() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { auth } = useAuth();
  const signOut = useSignOut();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        },
      }}
      navbarOffsetBreakpoint="md"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<MyNavbar opened={!opened} />}
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Image
                  src={MoaLogo}
                  height={40}
                  width={40}
                  styles={{ marginRight: 10 }}
                />
                <Title order={3}>MoA - GIMS</Title>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Text>username - {auth?.username}</Text>
                <Button
                  variant="subtle"
                  rightIcon={<Logout size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Box>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
