import {
  Box,
  Button,
  Center,
  Drawer,
  Group,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { UserPlus } from "tabler-icons-react";
import useAuth from "../../../hooks/useAuth";
import UsersDataGrid from "../../datagrids/UsersDataGrid";
import CreateUser from "./CreateUser";
import ResetUserPassword from "./ResetUserPassword";
import UpdateUser from "./UpdateUser";

function AllUsers() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newUser, setNewUser] = useState(null);

  if (auth?.userRole !== "admin")
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Title order={1}> Unauthorized </Title>
      </Box>
    );

  return (
    <>
      <Drawer
        opened={actionDrawer.opened}
        onClose={() => setActionDrawer((prev) => ({ ...prev, opened: false }))}
        title={actionDrawer.title}
        padding="xl"
        size="xl"
        position="right"
        lockScroll={true}
      >
        {actionDrawer.opened &&
          (actionDrawer.action === "create" ? (
            <CreateUser setNewUser={setNewUser} />
          ) : actionDrawer.action === "update" ? (
            <UpdateUser
              setNewUser={setNewUser}
              data={actionDrawer.data}
              setActionDrawer={setActionDrawer}
            />
          ) : (
            <ResetUserPassword
              setNewUser={setNewUser}
              data={actionDrawer.data}
              setActionDrawer={setActionDrawer}
            />
          ))}
      </Drawer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title order={1} sx={{ color: theme.colors.gray[6], marginBottom: 32 }}>
          Users
        </Title>
        <Group>
          <Button
            size="md"
            rightIcon={<UserPlus size={18} />}
            onClick={() =>
              setActionDrawer({
                opened: true,
                title: "New User Form",
                action: "create",
                data: {},
              })
            }
          >
            Create User
          </Button>
        </Group>
      </Box>
      <UsersDataGrid newUser={newUser} setActionDrawer={setActionDrawer} />
    </>
  );
}

export default AllUsers;
