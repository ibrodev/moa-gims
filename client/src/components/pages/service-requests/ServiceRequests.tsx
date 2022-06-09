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
import { useContext, useEffect, useState } from "react";
import { Plus, UserPlus } from "tabler-icons-react";
import DocumentTitleContext from "../../../contexts/DocumentTitleProvider";
import useAuth from "../../../hooks/useAuth";
import ServiceRequestsDataGrid from "../../datagrids/ServiceRequestsDataGrid";
import AssignInspector from "./AssignInspector";
import CreateServiceRequest from "./CreateServiceRequest";
import UpdateServiceRequest from "./UpdateServiceRequest";

function ServiceRequests() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newServiceRequest, setNewServiceRequest] = useState(null);

  const { setTitle } = useContext(DocumentTitleContext);

  useEffect(() => {
    setTitle((prev: any) => ({ ...prev, pageTitle: "Service Requests" }));
  }, []);

  if (auth?.userRole === "admin")
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
              <CreateServiceRequest
                setNewServiceRequest={setNewServiceRequest}
              />
            ) : actionDrawer.action === "update" ? (
              <UpdateServiceRequest
                setNewServiceRequest={setNewServiceRequest}
                data={actionDrawer.data}
                setActionDrawer={setActionDrawer}
              />
            ) : actionDrawer.action === "assignInspector" ? (
              <AssignInspector
                setNewServiceRequest={setNewServiceRequest}
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
          Service Requests
        </Title>
        <Group>
          {auth.userRole === "recorder" && (
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
              Create Service Request
            </Button>
          )}
        </Group>
      </Box>
      <ServiceRequestsDataGrid
        newServiceRequest={newServiceRequest}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default ServiceRequests;
