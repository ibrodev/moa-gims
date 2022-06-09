import { Title } from "@mantine/core";
import { Container } from "@mantine/core";
import { Select } from "@mantine/core";
import { Center } from "@mantine/core";
import { Grid } from "@mantine/core";
import { ThemeIcon } from "@mantine/core";
import { Stack } from "@mantine/core";
import { Card } from "@mantine/core";
import { Group } from "@mantine/core";
import { List } from "@mantine/core";
import { Accordion } from "@mantine/core";
import { Text } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Box } from "@mantine/core";
import moment from "moment";
import numeral from "numeral";
import { useContext, useEffect, useMemo, useState } from "react";
import { Car, CirclePlus, History } from "tabler-icons-react";
import DocumentTitleContext from "../../../contexts/DocumentTitleProvider";
import useVehiclesService from "../../../hooks/services/useVehiclesService";

function VehiclesHistory() {
  const { setTitle } = useContext(DocumentTitleContext);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState<any>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  const { getAll, getById } = useVehiclesService();

  const fetchVehicles = async () => {
    try {
      const vehicles = await getAll();
      setVehicles(vehicles);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchVehicle = async () => {
    if (!selectedVehicleId) return;

    try {
      setLoadingVehicle(true);
      const vehicle = await getById(selectedVehicleId);
      setVehicle(vehicle);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingVehicle(false);
    }
  };

  const vehicleData = useMemo(
    () =>
      vehicles.map((vehicle: any) => ({
        value: `${vehicle.id}`,
        label: `${vehicle.plateNo}`,
      })),
    [vehicles]
  );

  useEffect(() => {
    fetchVehicles();
    setTitle((prev: any) => ({ ...prev, pageTitle: "Vehicle History" }));
  }, []);

  useEffect(() => {
    fetchVehicle();
  }, [selectedVehicleId]);

  console.log(vehicle);

  if (loadingVehicles)
    return (
      <Container sx={{ height: "100%" }}>
        <Center
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Text color="gray">Loading...</Text>
          <Loader variant="dots" color="dark" mt={10} />
        </Center>
      </Container>
    );

  return (
    <Container fluid px={0}>
      <Box>
        <Title order={1} sx={{ color: "gray" }} mb={40}>
          Vehicle History
        </Title>
      </Box>
      <Select
        label="Vehicle Plate No"
        placeholder="Please search and select vehicle Plate No"
        data={vehicleData}
        searchable={true}
        maxDropdownHeight={200}
        sx={{ width: 320 }}
        size="md"
        value={selectedVehicleId}
        onChange={setSelectedVehicleId}
      />
      <Box mt={10}>
        {loadingVehicle ? (
          <Loader variant="dots" color="dark" />
        ) : vehicle.length === 0 ? (
          <Text size="lg" color="gray">
            Selected vehicle details and history will be shown here
          </Text>
        ) : (
          <Grid>
            <Grid.Col span={4}>
              <Accordion
                disableIconRotation
                initialItem={0}
                sx={(theme) => ({
                  backgroundColor: theme.white,
                  "& .mantine-Accordion-itemTitle	": {
                    "& :hover": {
                      backgroundColor: theme.colors.blue[0],
                    },
                  },
                  "& .mantine-Accordion-content": {
                    padding: 0 + "!important",
                  },
                })}
              >
                <Accordion.Item
                  label="Vehicle Details"
                  icon={
                    <ThemeIcon color="blue" variant="light">
                      <Car />
                    </ThemeIcon>
                  }
                >
                  <Stack sx={{ gap: 0 }}>
                    <Group position="apart">
                      <Text color="gray">Plate No</Text>
                      <Text>{vehicle.plateNo}</Text>
                    </Group>
                    <Group position="apart">
                      <Text color="gray">Manufacturer</Text>
                      <Text>{vehicle.manufacturer}</Text>
                    </Group>
                    <Group position="apart">
                      <Text color="gray">Model</Text>
                      <Text>{vehicle.model}</Text>
                    </Group>
                    <Group position="apart">
                      <Text color="gray">Engine No</Text>
                      <Text>{vehicle.engineNo ? vehicle.engineNo : "-"}</Text>
                    </Group>
                    <Group position="apart">
                      <Text color="gray">Chassis No</Text>
                      <Text>{vehicle.chassisNo ? vehicle.chassisNo : "-"}</Text>
                    </Group>
                    <Group position="apart">
                      <Text color="gray">Body Type</Text>
                      <Text>{vehicle.vehicleType?.name}</Text>
                    </Group>
                    <Group position="apart">
                      <Text color="gray">Project Owned</Text>
                      <Text>{vehicle.project ? "Yes" : "No"}</Text>
                    </Group>
                  </Stack>
                </Accordion.Item>
              </Accordion>
            </Grid.Col>
            <Grid.Col span={8}>
              <Card radius={0}>
                <Group>
                  <ThemeIcon color="blue" variant="light">
                    <History />
                  </ThemeIcon>
                  <Text>Vehicle History</Text>
                </Group>
                {vehicle.ServiceRequests?.some(
                  (sr: any) => sr.status === "completed"
                ) ? (
                  <>
                    <Box my={20} pl={12}>
                      <Title order={4} my={10}>
                        Summery
                      </Title>
                      <Grid>
                        <Grid.Col md={12} lg={4}>
                          <Card
                            sx={(theme) => ({
                              backgroundColor: theme.colors.lime[6],
                              padding: 10 + "!important",
                            })}
                          >
                            <Text
                              sx={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: "white",
                                lineHeight: 1,
                                marginBottom: 5,
                              }}
                            >
                              {numeral(
                                vehicle.ServiceRequests?.filter(
                                  (sr: any) => sr.status === "completed"
                                ).length
                              ).format("0,0")}
                            </Text>
                            <Text color="white" size="sm">
                              Service Requests
                            </Text>
                          </Card>
                        </Grid.Col>
                        <Grid.Col md={12} lg={4}>
                          <Card
                            sx={(theme) => ({
                              backgroundColor: theme.colors.violet[6],
                              padding: 10 + "!important",
                            })}
                          >
                            <Text
                              sx={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: "white",
                                lineHeight: 1,
                                marginBottom: 5,
                              }}
                            >
                              {numeral(
                                vehicle.ServiceRequests?.filter(
                                  (sr: any) => sr.status === "completed"
                                ).reduce(
                                  (acc: any, sr: any) =>
                                    acc + sr.WorkOrders.length,
                                  0
                                )
                              ).format("0,0")}
                            </Text>
                            <Text color="white" size="sm">
                              Work Orders
                            </Text>
                          </Card>
                        </Grid.Col>
                        <Grid.Col md={12} lg={4}>
                          <Card
                            sx={(theme) => ({
                              backgroundColor: theme.colors.blue[6],
                              padding: 10 + "!important",
                            })}
                          >
                            <Text
                              sx={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: "white",
                                lineHeight: 1,
                                marginBottom: 5,
                              }}
                            >
                              {numeral(
                                vehicle.ServiceRequests?.filter(
                                  (sr: any) => sr.status === "completed"
                                ).reduce(
                                  (acc: any, sr: any) =>
                                    acc +
                                    sr.WorkOrders.reduce(
                                      (acc: any, wo: any) =>
                                        acc +
                                        wo.SpareParts.reduce(
                                          (acc: any, sp: any) =>
                                            acc + sp.quantity * sp.unitPrice,
                                          0
                                        ),
                                      0
                                    ),
                                  0
                                )
                              ).format("0,0.00")}{" "}
                              <Text
                                sx={{ display: "inline", color: "white" }}
                                size="xs"
                              >
                                Birr
                              </Text>
                            </Text>
                            <Text color="white" size="sm">
                              Total Spare Parts Expense
                            </Text>
                          </Card>
                        </Grid.Col>
                      </Grid>
                    </Box>
                    <Card.Section>
                      <Accordion initialItem={0}>
                        {vehicle.ServiceRequests?.map((sr: any) => {
                          if (sr.status === "completed")
                            return (
                              <Accordion.Item
                                label={
                                  <Text weight="bold">
                                    {moment(sr.completedAt).format(
                                      "MMM DD, YYYY"
                                    )}
                                  </Text>
                                }
                              >
                                <Grid gutter={30}>
                                  <Grid.Col sm={6} md={4} xl={4}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Requested on</Text>
                                      <Text>
                                        {moment(sr.createdAt).format(
                                          "MMM DD, YYYY"
                                        )}
                                      </Text>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col sm={6} md={4} xl={4}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Completed on</Text>
                                      <Text>
                                        {moment(sr.completedAt).format(
                                          "MMM DD, YYYY"
                                        )}
                                      </Text>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col sm={6} md={4} xl={4}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Idle for</Text>
                                      <Text>
                                        {moment(sr.completedAt).diff(
                                          sr.createdAt,
                                          "days"
                                        )}{" "}
                                        Days
                                      </Text>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col sm={6} md={4} xl={4}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Requested by</Text>
                                      <Text>
                                        {sr.Driver?.firstName}{" "}
                                        {sr.Driver?.lastName}
                                      </Text>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col sm={6} md={4} xl={4}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Inspector</Text>
                                      <Text>
                                        {sr.Employee?.firstName}{" "}
                                        {sr.Employee?.lastName}
                                      </Text>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col sm={6} md={4} xl={4}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Odometer Reading</Text>
                                      <Text>
                                        {numeral(sr.odometerReading).format(
                                          "0,0"
                                        )}{" "}
                                        km
                                      </Text>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col md={12} lg={6} xl={6}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Recorded Faults</Text>
                                      <List>
                                        {sr.faults?.map((fault: any) => (
                                          <List.Item>
                                            {fault.description}
                                          </List.Item>
                                        ))}
                                      </List>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col md={12} lg={6} xl={6}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Performed Tasks</Text>
                                      <List>
                                        {sr.WorkOrders?.map((wo: any) =>
                                          wo.PerformedTasks?.map((pt: any) => (
                                            <List.Item>
                                              {pt.description}
                                            </List.Item>
                                          ))
                                        )}
                                      </List>
                                    </Stack>
                                  </Grid.Col>
                                  <Grid.Col span={12}>
                                    <Stack sx={{ gap: 0 }}>
                                      <Text color="gray">Used Parts</Text>
                                      <List>
                                        {sr.WorkOrders?.map((wo: any) =>
                                          wo.SpareParts?.map((sp: any) => (
                                            <List.Item>
                                              {sp.partName} ({sp.quantity}x)
                                            </List.Item>
                                          ))
                                        )}
                                      </List>
                                    </Stack>
                                  </Grid.Col>
                                </Grid>
                              </Accordion.Item>
                            );
                        })}
                      </Accordion>
                    </Card.Section>
                  </>
                ) : (
                  <Text mt={20} align="center" size="lg" color="gray">
                    Vehicle has no history
                  </Text>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default VehiclesHistory;
