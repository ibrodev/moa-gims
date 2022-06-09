import { Card } from "@mantine/core";
import { Title } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { Briefcase, Home, Id, User, Users } from "tabler-icons-react";
import useDepartmentsService from "../../../hooks/services/useDepartmentsService";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import usePositionsService from "../../../hooks/services/usePositionsService";
import useUsersService from "../../../hooks/services/useUsersService";

function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(null);
  const [employeesCount, setEmployeesCount] = useState(null);
  const [positionsCount, setPositionsCount] = useState(null);
  const [departmentsCount, setDepartmentsCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const { count: countUsers } = useUsersService();
  const { count: countEmployees } = useEmployeesService();
  const { count: countPositions } = usePositionsService();
  const { count: countDepartments } = useDepartmentsService();

  const theme = useMantineTheme();

  const countUsersFunc = async () => {
    try {
      const users = await countUsers();
      setUsersCount(users);
    } catch (error) {
      console.log(error);
    }
  };

  const countEmployeesFunc = async () => {
    try {
      const users = await countEmployees();
      setEmployeesCount(users);
    } catch (error) {
      console.log(error);
    }
  };

  const countPositionsFunc = async () => {
    try {
      const users = await countPositions();
      setPositionsCount(users);
    } catch (error) {
      console.log(error);
    }
  };

  const countDepartmentsFunc = async () => {
    try {
      const users = await countDepartments();
      setDepartmentsCount(users);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    countUsersFunc();
    countEmployeesFunc();
    countPositionsFunc();
    countDepartmentsFunc();
    setLoading(false);
  }, []);

  return (
    <Grid>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.teal[4] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {usersCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Users</Text>
            </Stack>
            <Users size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.pink[4] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {employeesCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Employees</Text>
            </Stack>
            <Id size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.orange[5] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {positionsCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Positions</Text>
            </Stack>
            <Briefcase size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.cyan[4] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {departmentsCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Departments</Text>
            </Stack>
            <Home size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default AdminDashboard;
