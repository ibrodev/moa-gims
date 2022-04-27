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
import { Plus, UserPlus } from "tabler-icons-react";
import useAuth from "../../../hooks/useAuth";
import UsersDataGrid from "../../datagrids/UsersDataGrid";
import VehiclesDataGrid from "../../datagrids/VehiclesDataGrid";
import CreateVehicle from "./CreateVehicle";
import UpdateVehicle from "./UpdateVehicle";

function Vehicles() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newVehicle, setNewVehicle] = useState(null);

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
            <CreateVehicle setNewVehicle={setNewVehicle} />
          ) : actionDrawer.action === "update" ? (
            <UpdateVehicle
              setNewVehicle={setNewVehicle}
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
          Vehicles
        </Title>
        <Group>
          <Button
            size="md"
            rightIcon={<Plus size={18} />}
            onClick={() =>
              setActionDrawer({
                opened: true,
                title: "New Vehicle Form",
                action: "create",
                data: {},
              })
            }
          >
            Create Vehicle
          </Button>
        </Group>
      </Box>
      <VehiclesDataGrid
        newVehicle={newVehicle}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default Vehicles;
