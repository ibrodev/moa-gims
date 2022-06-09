import { Modal } from "@mantine/core";
import { Box, Button, Group, Title, useMantineTheme } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";
import DocumentTitleContext from "../../../contexts/DocumentTitleProvider";
import useAuth from "../../../hooks/useAuth";
import WorkOrdersDataGrid from "../../datagrids/WorkOrdersDataGrid";
import CreateWorkOrder from "./CreateWorkOrders";

function WorkOrders() {
  const theme = useMantineTheme();
  const { auth } = useAuth();
  const [opened, setOpened] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState(null);

  const { setTitle } = useContext(DocumentTitleContext);

  useEffect(() => {
    setTitle((prev: any) => ({ ...prev, pageTitle: "Work Orders" }));
  }, []);

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
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        title="Create Work Order"
        overflow="inside"
        closeOnClickOutside={false}
        size={1000}
      >
        <CreateWorkOrder
          setNewWorkOrder={setNewWorkOrder}
          closeModal={() => setOpened(false)}
        />
      </Modal>
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
              onClick={() => setOpened(true)}
            >
              Create Work Order
            </Button>
          )}
        </Group>
      </Box>
      <WorkOrdersDataGrid newWorkOrder={newWorkOrder} />
    </>
  );
}

export default WorkOrders;
