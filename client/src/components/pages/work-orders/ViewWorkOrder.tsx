import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  useMantineTheme,
  Modal,
} from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  AntennaBars5,
  ArrowNarrowLeft,
  Briefcase,
  Building,
  BuildingWarehouse,
  Calendar,
  Car,
  CarCrash,
  Check,
  ClipboardList,
  DotsVertical,
  Hash,
  Pencil,
  PlayerPlay,
  PlaylistAdd,
  ShieldChevron,
  Tool,
  Trash,
  User,
  UserCircle,
  Checklist,
  Cash,
} from "tabler-icons-react";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";
import useAuth from "../../../hooks/useAuth";
import SetEndDate from "./SetEndDate";
import SetStartDate from "./SetStartDate";
import moment from "moment";
import numeral from "numeral";
import { List } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Grid } from "@mantine/core";
import _ from "lodash";
import AddSpareParts from "./AddSpareParts";
import Complete from "./Complete";
import { randomId } from "@mantine/hooks";

interface modalI {
  opened: boolean;
  title: string;
  content: React.ReactElement | null;
}

function ViewWorkOrder() {
  const [loading, setLoading] = useState(true);
  const [workOrder, setWorkOrder] = useState<any>({});
  const [newFault, setNewFault] = useState("");
  const [setUpdatingFaults] = useState(false);
  const [update, setUpdate] = useState("");
  const [modal, setModal] = useState<modalI>({
    opened: false,
    title: "",
    content: null,
  });
  const [deletingModal, setDeletingModal] = useState(false);
  const [startingModal, setStartingModal] = useState(false);

  const theme = useMantineTheme();
  const params = useParams();
  const { auth } = useAuth();
  const modals = useModals();
  const navigate = useNavigate();

  const { getOne, destroy, start } = useWorkOrdersService();

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

  const completeModal = () => {
    if (workOrder.SpareParts?.length === 0) {
      modals.openConfirmModal({
        title: "Please Confirm",
        closeOnConfirm: false,
        centered: true,
        withCloseButton: false,
        closeOnEscape: false,
        closeOnClickOutside: false,
        labels: { confirm: "Continue", cancel: "Cancel" },
        children: (
          <Text>
            You are about to complete this work order without registering any
            Spare Part. Please confirm that you want to continue.
          </Text>
        ),
        onConfirm: () => {
          setModal({
            opened: true,
            title: "Complete Work Order",
            content: (
              <Complete
                workOrder={workOrder}
                setUpdate={() => setUpdate(`${randomId()}`)}
                closeModal={() =>
                  setModal({
                    opened: false,
                    title: "",
                    content: null,
                  })
                }
              />
            ),
          });

          modals.closeAll();
        },
      });
    } else {
      setModal({
        opened: true,
        title: "Complete Work Order",
        content: (
          <Complete
            workOrder={workOrder}
            setUpdate={() => setUpdate(`${randomId()}`)}
            closeModal={() =>
              setModal({
                opened: false,
                title: "",
                content: null,
              })
            }
          />
        ),
      });
    }
  };

  const deleteModal = () => {
    const deleteModalId = modals.openConfirmModal({
      title: (
        <Title
          order={3}
          sx={{
            fontWeight: 400,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          mb={10}
        >
          <AlertCircle color="red" />
          Delete Work Order {workOrder.id}
        </Title>
      ),
      centered: true,
      children: (
        <Text size="md" mb={30}>
          Deleting this Work Order will permanently remove it from the database,
          this cannot be undone.
        </Text>
      ),
      closeOnConfirm: false,
      labels: {
        confirm: deletingModal ? "Deleting..." : "Delete",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red", loading: deletingModal },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleWorkOrderDelete(deleteModalId),
    });

    return deleteModalId;
  };

  const startModal = () => {
    const startModalId = modals.openConfirmModal({
      title: (
        <Title
          order={3}
          sx={{
            fontWeight: 400,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          mb={10}
        >
          <AlertCircle color="blue" />
          Start Work Order {workOrder.id}
        </Title>
      ),
      centered: true,
      children: (
        <Text size="md" mb={30}>
          You are about to start this work order, once you click start you can't
          undo this action. are you sure?
        </Text>
      ),
      closeOnConfirm: false,
      labels: {
        confirm: startingModal ? "Starting Work Order..." : "Start",
        cancel: "Cancel",
      },
      confirmProps: { color: "blue", loading: startingModal },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleWorkOrderStart(startModalId),
    });

    return startModalId;
  };

  const handleWorkOrderStart = async (modalId: any) => {
    try {
      setStartingModal(true);

      await start(workOrder.id, { startDate: Date.now() });
      modals.closeModal(modalId);

      showNotification({
        title: "Work Order Started",
        message: `Work Order with id ${workOrder.id} started successfully`,
        icon: <Check size={18} />,
      });

      setUpdate(`${Math.random()}`);
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingModal(false);
    }
  };

  const handleWorkOrderDelete = async (modalId: any) => {
    try {
      setDeletingModal(true);
      await destroy(workOrder.id);
      modals.closeModal(modalId);

      showNotification({
        title: "Work Order Deleted",
        message: `Work Order with id ${workOrder.id} deleted successfully`,
        icon: <Check size={18} />,
      });

      navigate("/work-orders");
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingModal(false);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [update]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "100px",
        }}
      >
        <Text color="gray">Loading users</Text>{" "}
        <Loader variant="dots" size={50} />{" "}
      </Box>
    );

  if (
    auth.userRole === "admin" ||
    auth.userRole === "team-leader" ||
    (auth.userRole === "inspector" &&
      workOrder.ServiceRequest?.inspectorId !== auth.user.employeeId)
  )
    return (
      <>
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
      </>
    );

  return (
    <>
      <Modal
        opened={modal.opened}
        onClose={() => setModal((prev) => ({ ...prev, opened: false }))}
        title={modal.title}
        centered
        closeOnClickOutside={false}
        size="70%"
        overflow="inside"
      >
        {modal.content}
      </Modal>

      <Container fluid sx={{ padding: 0 + "!important" }}>
        <Group mb={32} position="apart" sx={{ alignItems: "end" }}>
          <Box>
            <Title
              order={1}
              sx={{ color: theme.colors.gray[6], marginBottom: 2 }}
            >
              Work Order
            </Title>
            <Link
              to="/work-orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                textDecoration: "none",
                color: theme.colors.blue[6],
                width: "max-content",
              }}
            >
              <ArrowNarrowLeft size={20} /> Back to Work Orders
            </Link>
          </Box>
        </Group>
        <Box component="section" mb={30}>
          <Card>
            <Card.Section mb={15}>
              <Group position="apart" p={20}>
                <Text weight="bold">Work Order Details</Text>
                <Group spacing="xs">
                  {workOrder.status === "pending" &&
                    auth.userRole === "inspector" && (
                      <>
                        <Button
                          leftIcon={<PlayerPlay size={15} />}
                          size="xs"
                          onClick={startModal}
                        >
                          Start
                        </Button>
                        <Button
                          color="red"
                          size="xs"
                          leftIcon={<Trash size={15} />}
                          onClick={deleteModal}
                          loading={deletingModal}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  {workOrder.status === "in-progress" &&
                    auth.userRole === "inspector" && (
                      <>
                        <Button
                          size="xs"
                          leftIcon={<PlaylistAdd size={15} />}
                          onClick={() =>
                            setModal({
                              opened: true,
                              title: "Add Spare Parts",
                              content: (
                                <AddSpareParts
                                  workOrder={workOrder}
                                  closeModal={() =>
                                    setModal({
                                      opened: false,
                                      title: "",
                                      content: null,
                                    })
                                  }
                                  setUpdate={setUpdate}
                                />
                              ),
                            })
                          }
                        >
                          Add Spare Parts
                        </Button>
                        <Button
                          size="xs"
                          leftIcon={<Checklist size={15} />}
                          onClick={completeModal}
                        >
                          Complete
                        </Button>
                      </>
                    )}
                  {workOrder.status === "in-progress" &&
                    (auth.userRole === "inspector" ||
                      auth.userRole === "recorder") && (
                      <Menu
                        control={
                          <ActionIcon size="xs">
                            <DotsVertical size={20} />
                          </ActionIcon>
                        }
                        withArrow
                      >
                        <Menu.Item
                          component={Link}
                          to={`/print/work-order/${params.id}`}
                          target="_blank"
                        >
                          Print Work Order Form
                        </Menu.Item>
                        <Menu.Item
                          component={Link}
                          to={`/print/spare-part-listing/${params.id}`}
                          target="_blank"
                        >
                          Print Spare Parts Listing Form
                        </Menu.Item>
                      </Menu>
                    )}
                </Group>
              </Group>
              <Divider />
            </Card.Section>
            <Grid gutter="xl">
              <Grid.Col span={4}>
                <Stack sx={{ gap: 5 }} px="lg">
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Hash size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Work Order No</Text>
                    </Group>
                    <Text>
                      {workOrder.type === "project" ? "P" : "R"}/{workOrder.id}/
                      {moment(workOrder.createdAt).year()}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <UserCircle size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Inspector</Text>
                    </Group>
                    <Text>
                      {_.startCase(
                        workOrder.ServiceRequest?.Employee?.firstName
                      )}{" "}
                      {_.startCase(
                        workOrder.ServiceRequest?.Employee?.lastName
                      )}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <BuildingWarehouse
                        size={20}
                        color={theme.colors.dark[3]}
                      />
                      <Text weight={600}>Service Type</Text>
                    </Group>
                    <Text>
                      {_.startCase(_.camelCase(workOrder.serviceType))}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Calendar size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Start Date</Text>
                    </Group>
                    <Text>
                      {workOrder.startDate
                        ? moment(workOrder.startDate).format("MMM DD, YYYY")
                        : "Pending"}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Calendar size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>End Date</Text>
                    </Group>
                    <Text>
                      {workOrder.endDate
                        ? moment(workOrder.endDate).format("MMM DD, YYYY")
                        : workOrder.status === "in-progress"
                        ? "Work In Progress"
                        : "Pending"}
                    </Text>
                  </Group>
                  {workOrder.serviceType === "out-source" && (
                    <Group position="apart">
                      <Group sx={{ gap: 5 }}>
                        <ShieldChevron size={20} color={theme.colors.dark[3]} />
                        <Text weight={600}>Insurance Covered</Text>
                      </Group>
                      <Text>{workOrder.insurance ? "Yes" : "No"}</Text>
                    </Group>
                  )}
                  {workOrder.maintenanceType === "corrective" && (
                    <Group position="apart">
                      <Group sx={{ gap: 5 }}>
                        <CarCrash size={20} color={theme.colors.dark[3]} />
                        <Text weight={600}>Crash Accident</Text>
                      </Group>
                      <Text>{workOrder.crashAccident ? "Yes" : "No"}</Text>
                    </Group>
                  )}

                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <AntennaBars5 size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Status</Text>
                    </Group>
                    <Text>{workOrder.status}</Text>
                  </Group>

                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <ClipboardList size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Faults</Text>
                    </Group>
                  </Group>
                  <List withPadding>
                    {workOrder.Faults?.map((fault: any) => (
                      <List.Item key={fault.id}>{fault.description}</List.Item>
                    ))}
                  </List>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack sx={{ gap: 5 }} px="lg">
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Car size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Vehicle Detail</Text>
                    </Group>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Plate Number</Text>
                    </Group>
                    <Text>{workOrder.ServiceRequest?.Vehicle?.plateNo}</Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Manufacturer</Text>
                    </Group>
                    <Text>
                      {workOrder.ServiceRequest?.Vehicle?.manufacturer}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Model</Text>
                    </Group>
                    <Text>{workOrder.ServiceRequest?.Vehicle?.model}</Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Type</Text>
                    </Group>
                    <Text>
                      {workOrder.ServiceRequest?.Vehicle?.vehicleType?.name}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Engine Capacity</Text>
                    </Group>
                    <Text>
                      {workOrder.ServiceRequest?.Vehicle?.engineCapacity ||
                        "N/A"}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Odometer Reading</Text>
                    </Group>
                    <Text>
                      {numeral(
                        workOrder.ServiceRequest?.odometerReading
                      ).format("0,0") + " km"}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <User size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Driver</Text>
                    </Group>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Name</Text>
                    </Group>
                    <Text>
                      {_.capitalize(
                        workOrder.ServiceRequest?.Driver?.firstName
                      )}{" "}
                      {_.capitalize(workOrder.ServiceRequest?.Driver?.lastName)}
                    </Text>
                  </Group>

                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Driving License No</Text>
                    </Group>
                    <Text>{workOrder.ServiceRequest?.Driver?.licenseNo}</Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack sx={{ gap: 5 }} px="lg">
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Tool size={20} color={theme.colors.dark[3]} />
                      <Text weight={600}>Maintenance</Text>
                    </Group>
                  </Group>
                  <Group position="apart">
                    <Group sx={{ gap: 5 }}>
                      <Box sx={{ width: 20, height: 20 }}></Box>
                      <Text>Type</Text>
                    </Group>
                    <Text>
                      {_.capitalize(workOrder.maintenanceType)} Maintenance
                    </Text>
                  </Group>
                  {workOrder.serviceType === "in-house" && (
                    <Group position="apart">
                      <Group sx={{ gap: 5 }}>
                        <Box sx={{ width: 20, height: 20 }}></Box>
                        <Text>Location</Text>
                      </Group>
                      <Text>
                        {_.startCase(
                          _.camelCase(workOrder.maintenanceLocation)
                        )}
                      </Text>
                    </Group>
                  )}

                  {workOrder.serviceType === "in-house" && (
                    <>
                      <Group position="apart">
                        <Group sx={{ gap: 5 }}>
                          <Briefcase size={20} color={theme.colors.dark[3]} />
                          <Text weight={600}>Work Detail</Text>
                        </Group>
                      </Group>
                      <Group position="apart">
                        <Group sx={{ gap: 5 }}>
                          <Box sx={{ width: 20, height: 20 }}></Box>
                          <Text>Department</Text>
                        </Group>
                        <Text>{workOrder.workDepartment}</Text>
                      </Group>
                      <Group position="apart">
                        <Group sx={{ gap: 5 }}>
                          <Box sx={{ width: 20, height: 20 }}></Box>
                          <Text>Expert</Text>
                        </Group>
                        <Text>
                          {workOrder.Employee?.firstName}{" "}
                          {workOrder.Employee?.lastName}
                        </Text>
                      </Group>
                    </>
                  )}

                  {workOrder.serviceType === "out-source" &&
                    workOrder.status === "completed" && (
                      <Group position="apart" my={20}>
                        <Group sx={{ gap: 5 }}>
                          <Cash size={20} color={theme.colors.dark[3]} />
                          <Text weight={600}>Service Cost</Text>
                        </Group>
                        <Text underline>
                          {numeral(workOrder.serviceCost).format("0,0.00")} Birr
                        </Text>
                      </Group>
                    )}
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Box>
        {workOrder.SpareParts.length > 0 && (
          <Box component="section">
            <Grid>
              <Grid.Col span={12}>
                <Card>
                  <Card.Section mb={15}>
                    <Group position="apart" p={20}>
                      <Text weight="bold">Work Order Spare Parts</Text>
                      <Group spacing="xs"></Group>
                    </Group>
                    <Divider />
                  </Card.Section>
                  <Table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Part Number</th>
                        <th>Part Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrder.SpareParts.map(
                        (sparePart: any, index: number) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{sparePart.partNumber}</td>
                            <td>{sparePart.partName}</td>
                            <td>{sparePart.quantity}</td>
                            <td>
                              {numeral(sparePart.unitPrice).format("0,0.00")}
                            </td>
                            <td>
                              {numeral(
                                sparePart.quantity * sparePart.unitPrice
                              ).format("0,0.00")}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={5}>Grand Total</th>
                        <th>
                          {numeral(
                            workOrder.SpareParts?.reduce(
                              (
                                prv: any,
                                current: any,
                                currentI: any,
                                array: any
                              ) => prv + current.unitPrice * current.quantity,
                              0
                            )
                          ).format("0,0.00")}
                        </th>
                      </tr>
                    </tfoot>
                  </Table>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}></Grid.Col>
            </Grid>
          </Box>
        )}

        {workOrder.status === "completed" && (
          <Box component="section">
            <Grid>
              <Grid.Col span={12}>
                <Card>
                  <Card.Section mb={15}>
                    <Group position="apart" p={20}>
                      <Text weight="bold">Work Order Tasks</Text>
                      <Group spacing="xs"></Group>
                    </Group>
                    <Divider />
                  </Card.Section>
                  <Table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Task Description</th>
                        <th>Task Labour Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrder.PerformedTasks.map(
                        (task: any, index: number) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{task.description}</td>
                            <td>{numeral(task.labourCost).format("0,0.00")}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={2}></th>
                        <th>
                          Total{" "}
                          {numeral(
                            workOrder.PerformedTasks?.reduce(
                              (
                                prv: any,
                                current: any,
                                currentI: any,
                                array: any
                              ) => prv + current.labourCost,
                              0
                            )
                          ).format("0,0.00")}
                        </th>
                      </tr>
                    </tfoot>
                  </Table>
                </Card>
              </Grid.Col>
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}

export default ViewWorkOrder;
