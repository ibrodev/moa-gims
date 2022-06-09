import {
  Box,
  Button,
  Center,
  Drawer,
  Group,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Plus, UserPlus } from "tabler-icons-react";
import DocumentTitleContext from "../../../contexts/DocumentTitleProvider";
import useAuth from "../../../hooks/useAuth";
import EmployeeDataGrid from "../../datagrids/EmployeesDataGrid";
import CreateEmployee from "./CreateEmployee";
import UpdateEmployee from "./UpdateEmployee";

function Employees() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newEmployee, setNewEmployee] = useState(null);

  const { setTitle } = useContext(DocumentTitleContext);

  useEffect(() => {
    setTitle((prev: any) => ({ ...prev, pageTitle: "Employees" }));
  }, []);

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
            <CreateEmployee setNewEmployee={setNewEmployee} />
          ) : actionDrawer.action === "update" ? (
            <UpdateEmployee
              setNewEmployee={setNewEmployee}
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
          Employees
        </Title>
        <Group>
          <Button
            size="md"
            rightIcon={<Plus size={18} />}
            onClick={() =>
              setActionDrawer({
                opened: true,
                title: "New Employee Form",
                action: "create",
                data: {},
              })
            }
          >
            Create Employee
          </Button>
        </Group>
      </Box>
      <EmployeeDataGrid
        newEmployee={newEmployee}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default Employees;
