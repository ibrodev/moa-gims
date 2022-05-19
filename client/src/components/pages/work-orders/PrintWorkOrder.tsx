import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Divider,
  Group,
  List,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";

const useStyles = createStyles((theme) => ({
  paper: {
    backgroundColor: theme.white,
    padding: "5rem",

    width: "70%",
    margin: "0 auto",
    "@media print": {
      width: "100%",
      height: "100vh",
      padding: "1.5rem",
    },
  },

  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2rem",

    "& .wo-number": {
      alignSelf: "end",
      marginBottom: "2rem",

      "& span": {
        fontWeight: "bold",
        textDecoration: "underline",
      },
    },

    "& .header-subtitle": {
      fontWeight: "normal",
      textDecoration: "underline",
    },
  },

  body: {
    "& section": {
      marginBottom: "2rem",
    },
    "& .section-title": {
      marginBottom: ".5rem",
      color: theme.colors.gray[8],
    },

    "& .wo-details-stack": {
      gap: "2px",
    },
  },

  footer: {
    width: "70%",
    margin: "0 auto",
    padding: "2rem 0",
    "@media print": {
      display: "none",
    },
  },
}));

function PrintWorkOrder() {
  const [workOrder, setWorkOrder] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { getOne } = useWorkOrdersService();
  const { classes } = useStyles();

  const fetchWorkOrder = async () => {
    try {
      const workOrder = await getOne(params.id);
      setWorkOrder(workOrder);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, []);

  if (loading)
    return (
      <Center style={{ width: "100%", height: "100vh" }}>
        <Loader variant="dots" size={50} />
      </Center>
    );
  return (
    <>
      <Box className={classes.paper}>
        <Box className={classes.header}>
          <Text className="wo-number">
            WONo: <span>{workOrder.id}</span>
          </Text>
          <Title order={2} className="header-title">
            Ministry of Agriculture
          </Title>
          <Title order={4} className="header-subtitle">
            Work Order Form for Vehicles Maintenance Services
          </Title>
        </Box>
        <Box className={classes.body}>
          <Box component="section" className="wo-details">
            <Title order={5} className="section-title">
              Work Order Details
            </Title>

            <SimpleGrid cols={2}>
              <Stack className="wo-details-stack">
                <Group>
                  <Text>Plate No:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Vehicle.plateNo}
                  </Text>
                </Group>
                <Group>
                  <Text>Model:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Vehicle.model}
                  </Text>
                </Group>
                <Group>
                  <Text>Manufacturer:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Vehicle.manufacturer}
                  </Text>
                </Group>
                <Group>
                  <Text>Chassis No:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Vehicle.chassisNo || "-"}
                  </Text>
                </Group>
                <Group>
                  <Text>Engine No:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Vehicle.engineNo || "-"}
                  </Text>
                </Group>
                <Group>
                  <Text>Odometer Reading:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.odometerReading}
                    {" km"}
                  </Text>
                </Group>
                <Group>
                  <Text>Driver:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Driver.firstName}{" "}
                    {workOrder.ServiceRequest.Driver.lastName}
                  </Text>
                </Group>
              </Stack>
              <Stack className="wo-details-stack">
                <Group>
                  <Text>Inspector:</Text>
                  <Text weight={600} underline>
                    {workOrder.ServiceRequest.Employee.firstName}{" "}
                    {workOrder.ServiceRequest.Employee.lastName}
                  </Text>
                </Group>
                <Group>
                  <Text>Work Type:</Text>
                  <Text weight={600} underline>
                    {workOrder.workType}
                  </Text>
                </Group>
                <Group>
                  <Text>Expert:</Text>
                  <Text weight={600} underline>
                    {workOrder.Employee.firstName}{" "}
                    {workOrder.Employee.firstName}
                  </Text>
                </Group>
                <Group>
                  <Text>Signature:</Text>
                  <Text>{"_____________"}</Text>
                </Group>
              </Stack>
            </SimpleGrid>
          </Box>
          <Box component="section" className="faults">
            <Title order={5} className="section-title">
              Initial Faults
            </Title>
            <Stack>
              <List>
                {workOrder.Faults.map((fault: any) => (
                  <List.Item>{fault.description}</List.Item>
                ))}
              </List>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box className={classes.footer}>
        <Button onClick={() => window.print()}>Print</Button>
      </Box>
    </>
  );
}

export default PrintWorkOrder;
