import { Card } from "@mantine/core";
import { Title } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { Car, CarCrash, Tool, User } from "tabler-icons-react";
import useDriversService from "../../../hooks/services/useDriversService";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";
import useVehiclesService from "../../../hooks/services/useVehiclesService";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";

function RecorderDashboard() {
  const [serviceRequestsCount, setServiceRequestsCount] = useState(null);
  const [workOrdersCount, setWorkOrdersCount] = useState(null);
  const [vehiclesCount, setVehiclesCount] = useState(null);
  const [driversCount, setDriversCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const { count: countServiceRequests } = useServiceRequestsService();
  const { count: countWorkOrders } = useWorkOrdersService();
  const { count: countVehicles } = useVehiclesService();
  const { count: countDrivers } = useDriversService();

  const theme = useMantineTheme();

  const countServiceRequestsFunc = async () => {
    try {
      const serviceRequests = await countServiceRequests();
      setServiceRequestsCount(serviceRequests);
    } catch (error) {
      console.log(error);
    }
  };

  const countWorkOrdersFunc = async () => {
    try {
      const workOrders = await countWorkOrders();
      setWorkOrdersCount(workOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const countVehiclesFunc = async () => {
    try {
      const vehicles = await countVehicles();
      setVehiclesCount(vehicles);
    } catch (error) {
      console.log(error);
    }
  };

  const countDriversFunc = async () => {
    try {
      const drivers = await countDrivers();
      setDriversCount(drivers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    countServiceRequestsFunc();
    countWorkOrdersFunc();
    countVehiclesFunc();
    countDriversFunc();
    setLoading(false);
  }, []);

  return (
    <Grid>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.teal[4] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {serviceRequestsCount}
              </Title>
              <Text sx={{ color: "white" }}>Total SRs</Text>
            </Stack>
            <CarCrash size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.pink[4] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {workOrdersCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Work Orders</Text>
            </Stack>
            <Tool size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.orange[5] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {vehiclesCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Vehicles</Text>
            </Stack>
            <Car size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card sx={(theme) => ({ backgroundColor: theme.colors.cyan[4] })}>
          <Group position="apart">
            <Stack sx={{ gap: 0 }}>
              <Title sx={{ textAlign: "center", color: "white", fontSize: 50 }}>
                {driversCount}
              </Title>
              <Text sx={{ color: "white" }}>Total Drivers</Text>
            </Stack>
            <User size={50} color="white" />
          </Group>
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default RecorderDashboard;
