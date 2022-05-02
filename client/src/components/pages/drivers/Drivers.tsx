import {
  Box,
  Button,
  Drawer,
  Group,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import useAuth from "../../../hooks/useAuth";
import DriversDataGrid from "../../datagrids/DriversDataGrid";
import CreateDrivers from "./CreateDrivers";
import UpdateDriver from "./UpdateDrivers";

function Drivers() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newDriver, setNewDriver] = useState(null);

  if (auth?.userRole !== "recorder")
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
            <CreateDrivers setNewDriver={setNewDriver} />
          ) : actionDrawer.action === "update" ? (
            <UpdateDriver
              setNewDriver={setNewDriver}
              data={actionDrawer.data}
              setActionDrawer={setActionDrawer}
            />
          ) : (
            <></>
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
          Drivers
        </Title>
        <Group>
          <Button
            size="md"
            rightIcon={<Plus size={18} />}
            onClick={() =>
              setActionDrawer({
                opened: true,
                title: "New Driver Form",
                action: "create",
                data: {},
              })
            }
          >
            Create Driver
          </Button>
        </Group>
      </Box>
      <DriversDataGrid
        newDriver={newDriver}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default Drivers;
