import {
  Box,
  Button,
  Drawer,
  Group,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { Plus, UserPlus } from "tabler-icons-react";
import useAuth from "../../../hooks/useAuth";
import DepartmentsDataGrid from "../../datagrids/DepartmentsDataGrid";
import CreateDepartment from "./CreateDepartments";
import UpdateDepartment from "./UpdateDepartments";

function Departments() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newDepartment, setNewDepartment] = useState(null);

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
            <CreateDepartment setNewDepartment={setNewDepartment} />
          ) : actionDrawer.action === "update" ? (
            <UpdateDepartment
              setNewDepartment={setNewDepartment}
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
          Departments
        </Title>
        <Group>
          <Button
            size="md"
            rightIcon={<Plus size={18} />}
            onClick={() =>
              setActionDrawer({
                opened: true,
                title: "New Department Form",
                action: "create",
                data: {},
              })
            }
          >
            Create Department
          </Button>
        </Group>
      </Box>
      <DepartmentsDataGrid
        newDepartment={newDepartment}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default Departments;
