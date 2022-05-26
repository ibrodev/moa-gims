import {
  Box,
  Button,
  Center,
  Drawer,
  Group,
  ScrollArea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { Plus, UserPlus } from "tabler-icons-react";
import useAuth from "../../../hooks/useAuth";
import ServiceRequestsDataGrid from "../../datagrids/ServiceRequestsDataGrid";
import WorkOrdersDataGrid from "../../datagrids/WorkOrdersDataGrid";
import AssignInspector from "../service-requests/AssignInspector";
import UpdateServiceRequest from "../service-requests/UpdateServiceRequest";
import CreateWorkOrder from "./CreateWorkOrders";
import UpdateWorkOrder from "./UpdateWorkOrders";
// import AssignInspector from "./AssignInspector";
// import CreateServiceRequest from "./CreateServiceRequest";
// import UpdateOdometerReading from "./UpdateOdometerReading";
// import UpdateServiceRequest from "./UpdateServiceRequest";

function WorkOrders() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newWorkOrder, setNewWorkOrder] = useState(null);

  if (auth?.userRole === "admin" || auth?.userRole === "team-leader")
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
      >
        <ScrollArea
          style={{ height: "100%", padding: "0 0 50px 0" }}
          offsetScrollbars
        >
          {actionDrawer.opened &&
            (actionDrawer.action === "create" ? (
              <CreateWorkOrder setNewWorkOrder={setNewWorkOrder} />
            ) : actionDrawer.action === "update" ? (
              <UpdateWorkOrder
                setNewWorkOrder={setNewWorkOrder}
                data={actionDrawer.data}
                setActionDrawer={setActionDrawer}
              />
            ) : actionDrawer.action === "assignInspector" ? (
              <AssignInspector
                setNewWorkOrder={setNewWorkOrder}
                data={actionDrawer.data}
                setActionDrawer={setActionDrawer}
              />
            ) : actionDrawer.action === "updateOdometerReading" ? (
              <></>
            ) : (
              <></>
            ))}
        </ScrollArea>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title order={1} sx={{ color: theme.colors.gray[6], marginBottom: 32 }}>
          Work Orders
        </Title>
        <Group>
          {auth.userRole === "inspector" && (
            <Button
              size="md"
              rightIcon={<Plus size={18} />}
              onClick={() =>
                setActionDrawer({
                  opened: true,
                  title: "New Service Request Form",
                  action: "create",
                  data: {},
                })
              }
            >
              Create Work Order
            </Button>
          )}
        </Group>
      </Box>
      <WorkOrdersDataGrid
        newWorkOrder={newWorkOrder}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default WorkOrders;
