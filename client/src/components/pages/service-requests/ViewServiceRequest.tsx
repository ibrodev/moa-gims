import { Title } from "@mantine/core";
import { Box } from "@mantine/core";
import { Grid } from "@mantine/core";
import { Card } from "@mantine/core";
import { Divider } from "@mantine/core";
import { Group } from "@mantine/core";
import { Stack } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Text } from "@mantine/core";
import { Container } from "@mantine/core";
import {
  ReactComponentElement,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  AntennaBars5,
  ArrowNarrowLeft,
  Check,
  ListDetails,
  Pencil,
  PlaylistX,
  Plus,
  RotateClockwise,
  Send,
  Tool,
  Trash,
} from "tabler-icons-react";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";
import moment from "moment";
import { Loader } from "@mantine/core";
import { Anchor } from "@mantine/core";
import { SimpleGrid } from "@mantine/core";
import useAuth from "../../../hooks/useAuth";
import { Button } from "@mantine/core";
import { Table } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Drawer } from "@mantine/core";
import { ScrollArea } from "@mantine/core";
import UpdateServiceRequest from "./UpdateServiceRequest";
import AddFaults from "./AddFaults";
import { randomId } from "@mantine/hooks";
import numeral from "numeral";
import { Modal } from "@mantine/core";
import AssignInspector from "./AssignInspector";
import AcceptServiceRequest from "./AcceptServiceRequest";
import _ from "lodash";
import { RingProgress } from "@mantine/core";

interface modalI {
  opened: boolean;
  title: string;
  content: React.ReactElement | null;
}

function ViewServiceRequest() {
  const { id } = useParams();
  const theme = useMantineTheme();
  const { auth } = useAuth();
  const modals = useModals();
  const navigate = useNavigate();

  const [serviceRequest, setServiceRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFaults, setSelectedFaults] = useState<any>([]);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [actionDrawer, setActionDrawer] = useState<{
    opened: boolean;
    title: string;
    contentComponent: null | ReactElement;
  }>({
    opened: false,
    title: "",
    contentComponent: null,
  });
  const [modal, setModal] = useState<modalI>({
    opened: false,
    title: "",
    content: null,
  });
  const [newServiceRequest, setNewServiceRequest] = useState<any>(null);

  const { getById, destroy, deleteFaults, update, complete } =
    useServiceRequestsService();

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
          Delete Service Request {serviceRequest.id}
        </Title>
      ),
      centered: true,
      children: (
        <Text size="md" mb={30}>
          Deleting this Service Request will permanently remove it from the
          database, this cannot be undone.
        </Text>
      ),
      closeOnConfirm: false,
      labels: {
        confirm: deleting ? "Deleting..." : "Delete",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red", loading: deleting },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleServiceRequestDelete(deleteModalId),
    });
  };

  const completeModal = () => {
    const completeModalId = modals.openConfirmModal({
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
          <AlertCircle color="orange" />
          Complete Service Request {serviceRequest.id}
        </Title>
      ),
      centered: true,
      children: (
        <Text size="md" mb={30}>
          You are about to set this Service Request as completed. Are you sure
          you want to do this
        </Text>
      ),
      closeOnConfirm: false,
      labels: {
        confirm: completing ? "Completing..." : "Complete",
        cancel: "Cancel",
      },
      confirmProps: { color: "blue", loading: completing },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleServiceRequestComplete(completeModalId),
    });
  };

  const deleteFaultsModal = () => {
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
          Delete Selected Faults {serviceRequest.id}
        </Title>
      ),
      centered: true,
      children: (
        <Text size="md" mb={30}>
          Deleting these Faults will permanently remove theme from the database,
          this cannot be undone.
        </Text>
      ),
      closeOnConfirm: false,
      labels: {
        confirm: deleting ? "Deleting..." : "Delete",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red", loading: deleting },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleFaultsDelete(deleteModalId),
    });
  };

  const submitServiceRequestModal = () => {
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
          <AlertCircle color="orange" />
          Submit Service Request {serviceRequest.id}
        </Title>
      ),
      centered: true,
      children: (
        <Text size="md" mb={30}>
          Are you sure, this action cannot be undone.
        </Text>
      ),
      closeOnConfirm: false,
      labels: {
        confirm: deleting ? "Submitting..." : "Submit",
        cancel: "Cancel",
      },
      confirmProps: { color: "blue", loading: deleting },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleServiceRequestSubmit(deleteModalId),
    });
  };

  const handleServiceRequestSubmit = async (modalId: string) => {
    try {
      setLoading(true);
      await update(id, {
        status: "submitted",
      });

      showNotification({
        title: "Service Request Submitted",
        message: `Service Request submitted successfully`,
        icon: <Check size={18} />,
      });
      modals.closeModal(modalId);
      setNewServiceRequest(randomId());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFaultsDelete = async (modalId: any) => {
    try {
      setDeleting(true);
      await deleteFaults(serviceRequest.id, { faults: selectedFaults });

      modals.closeModal(modalId);

      showNotification({
        title: "Selected Faults Deleted",
        message: `Selected Faults deleted successfully`,
        icon: <Check size={18} />,
      });

      setNewServiceRequest(randomId());
      setSelectedFaults([]);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleServiceRequestDelete = async (modalId: any) => {
    try {
      setDeleting(true);
      await destroy(serviceRequest.id);

      modals.closeModal(modalId);

      showNotification({
        title: "Service Request Deleted",
        message: `Service Request with id ${serviceRequest.id} deleted successfully`,
        icon: <Check size={18} />,
      });

      navigate("/service-requests");
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleServiceRequestComplete = async (modalId: any) => {
    try {
      setCompleting(true);
      await complete(serviceRequest.id);

      modals.closeModal(modalId);

      showNotification({
        title: "Service Request Set as Completed",
        message: `Service Request with id ${serviceRequest.id} set as completed successfully`,
        icon: <Check size={18} />,
      });

      setNewServiceRequest(randomId());
    } catch (error) {
      console.log(error);
    } finally {
      setCompleting(false);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await getById(id);
      setServiceRequest(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFaultSelect = (e: any, faultId: any) => {
    if (e.target.checked) {
      setSelectedFaults([...selectedFaults, faultId]);
    } else {
      selectedFaults.pop(faultId);
      setSelectedFaults([...selectedFaults]);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [newServiceRequest]);

  return (
    <>
      <Modal
        opened={modal.opened}
        onClose={() => setModal((prev) => ({ ...prev, opened: false }))}
        title={modal.title}
        centered
        closeOnClickOutside={false}
      >
        {modal.content}
      </Modal>
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
          {actionDrawer.contentComponent && actionDrawer.contentComponent}
        </ScrollArea>
      </Drawer>

      <Container fluid sx={{ padding: "0 !important" }}>
        <Box sx={{ marginBottom: 20 }}>
          <Title
            order={1}
            sx={{
              color: `${theme.colors.gray[6]} !important`,
            }}
          >
            Service Request
          </Title>
          <Anchor
            component={Link}
            to="/service-requests"
            sx={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                textDecoration: "none",
              },
            }}
          >
            <ArrowNarrowLeft size={20} />
            <span>Back to Service Requests</span>
          </Anchor>
        </Box>
        {loading ? (
          <Box
            sx={{
              padding: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Loading Service Request...</Text>
            <Loader variant="dots" color="black" />
          </Box>
        ) : (
          <>
            <SimpleGrid cols={2} mb={20}>
              <Card>
                <Card.Section mb={15}>
                  <Group position="apart" p={20}>
                    <Text weight="bold">SR Detail</Text>
                    <Group spacing="xs">
                      {serviceRequest.status === "draft" &&
                        auth.userRole === "recorder" && (
                          <>
                            <Button
                              color="red"
                              size="xs"
                              leftIcon={<Trash size={15} />}
                              onClick={deleteModal}
                            >
                              Delete
                            </Button>
                            <Button
                              leftIcon={<Pencil size={15} />}
                              size="xs"
                              onClick={() =>
                                setActionDrawer((prev: any) => ({
                                  ...prev,
                                  opened: true,
                                  title: "Edit Service Request",
                                  contentComponent: (
                                    <UpdateServiceRequest
                                      setNewServiceRequest={
                                        setNewServiceRequest
                                      }
                                      setActionDrawer={setActionDrawer}
                                      data={serviceRequest}
                                    />
                                  ),
                                }))
                              }
                            >
                              Edit
                            </Button>

                            {serviceRequest.faults?.length > 0 && (
                              <Button
                                size="xs"
                                leftIcon={<Send size={15} />}
                                onClick={submitServiceRequestModal}
                              >
                                Submit
                              </Button>
                            )}
                          </>
                        )}

                      {serviceRequest.status === "pending-inspection" &&
                        auth.userRole === "inspector" && (
                          <>
                            <Button
                              leftIcon={<Check size={15} />}
                              size="xs"
                              onClick={() =>
                                setModal({
                                  opened: true,
                                  title: "Accept Service Request",
                                  content: (
                                    <AcceptServiceRequest
                                      setNewServiceRequest={
                                        setNewServiceRequest
                                      }
                                      closeModal={() =>
                                        setModal((prev) => ({
                                          ...prev,
                                          opened: false,
                                        }))
                                      }
                                      data={serviceRequest}
                                    />
                                  ),
                                })
                              }
                            >
                              Accept
                            </Button>
                          </>
                        )}

                      {serviceRequest.status === "submitted" &&
                        auth.userRole === "team-leader" && (
                          <>
                            <Button
                              leftIcon={<Pencil size={15} />}
                              size="xs"
                              onClick={() =>
                                setModal({
                                  opened: true,
                                  title: "Assign Inspector",
                                  content: (
                                    <AssignInspector
                                      setNewServiceRequest={
                                        setNewServiceRequest
                                      }
                                      closeModal={() =>
                                        setModal((prev) => ({
                                          ...prev,
                                          opened: false,
                                        }))
                                      }
                                      data={serviceRequest}
                                    />
                                  ),
                                })
                              }
                            >
                              Assign Inspector
                            </Button>
                          </>
                        )}

                      {serviceRequest.status === "accepted" &&
                        auth.userRole === "recorder" &&
                        serviceRequest.faults.filter(
                          (fault: any) => !fault.workOrderId
                        ).length === 0 &&
                        serviceRequest.WorkOrders.length ===
                          serviceRequest.WorkOrders?.filter(
                            (wo: any) => wo.status === "completed"
                          ).length && (
                          <>
                            <Button
                              leftIcon={<Check size={15} />}
                              size="xs"
                              onClick={completeModal}
                            >
                              Complete
                            </Button>
                          </>
                        )}
                    </Group>
                  </Group>
                  <Divider />
                </Card.Section>
                <Stack spacing="xs">
                  <Group position="apart">
                    <Text>#SR No</Text>
                    <Text>{serviceRequest.id}</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Vehicle Plate No</Text>
                    <Text>{serviceRequest.Vehicle.plateNo}</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Department</Text>
                    <Text>{serviceRequest.Department.name}</Text>
                  </Group>
                  <Group position="apart">
                    <Text>Driver</Text>
                    <Text>
                      {serviceRequest.Driver.firstName}{" "}
                      {serviceRequest.Driver.lastName}
                    </Text>
                  </Group>

                  <>
                    <Group position="apart">
                      <Text>Inspector</Text>
                      {serviceRequest.inspectorId ? (
                        <Text>
                          {serviceRequest.Employee?.firstName}{" "}
                          {serviceRequest.Employee?.lastName}
                        </Text>
                      ) : (
                        <Text color="dimmed" weight="bold">
                          -
                        </Text>
                      )}
                    </Group>
                    <Group position="apart">
                      <Text>Odometer Reading</Text>
                      {serviceRequest.odometerReading ? (
                        <Text>
                          {numeral(serviceRequest.odometerReading).format(
                            "0,0"
                          )}{" "}
                          km
                        </Text>
                      ) : (
                        <Text color="dimmed" weight="bold">
                          -
                        </Text>
                      )}
                    </Group>
                  </>
                </Stack>
              </Card>
              <Card>
                <Card.Section mb={15}>
                  <Group position="apart" p={20}>
                    <Text weight="bold">SR Faults</Text>
                    <Group spacing="xs">
                      {selectedFaults.length > 0 && (
                        <>
                          <Button
                            leftIcon={<Trash size={15} />}
                            size="xs"
                            color="red"
                            onClick={deleteFaultsModal}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Group>
                  </Group>
                  <Divider />
                </Card.Section>

                {serviceRequest.faults?.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRequest.faults.map((fault: any) => (
                        <tr key={fault.id}>
                          <td>{fault.description}</td>
                          {serviceRequest.status === "draft" ? (
                            <td>
                              <Checkbox
                                size="xs"
                                onChange={(event) =>
                                  handleFaultSelect(event, fault.id)
                                }
                              />
                            </td>
                          ) : (
                            <td></td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Text color="dimmed" mb={20}>
                      No Faults
                    </Text>
                    {serviceRequest.status === "draft" && (
                      <Button
                        leftIcon={<Plus size={15} />}
                        onClick={() =>
                          setActionDrawer({
                            opened: true,
                            title: "Add Faults to Service Request",
                            contentComponent: (
                              <AddFaults
                                data={serviceRequest}
                                setNewServiceRequest={setNewServiceRequest}
                                setActionDrawer={setActionDrawer}
                              />
                            ),
                          })
                        }
                      >
                        Add Faults
                      </Button>
                    )}
                  </Box>
                )}
              </Card>
            </SimpleGrid>
            <Grid>
              <Grid.Col span={3}>
                <Card shadow="xs" sx={{ height: "100%" }}>
                  <Stack>
                    <Group position="apart">
                      <Text transform="uppercase" color="dimmed" weight="bold">
                        Status
                      </Text>
                      <AntennaBars5 color={theme.colors.gray[5]} />
                    </Group>
                    <Title my={10} align="center">
                      {serviceRequest.status === "submitted" &&
                      auth.userRole === "team-leader"
                        ? "Received"
                        : _.capitalize(serviceRequest.status)}
                    </Title>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={3}>
                <Card shadow="xs" sx={{ height: "100%" }}>
                  <Stack>
                    <Group position="apart">
                      <Text transform="uppercase" color="dimmed" weight="bold">
                        Faults
                      </Text>
                      <PlaylistX color={theme.colors.gray[5]} />
                    </Group>
                    <Group position="center">
                      <RingProgress
                        sections={[
                          {
                            value:
                              serviceRequest.faults.length > 0
                                ? (serviceRequest.faults.filter(
                                    (fault: any) => fault.workOrderId
                                  ).length /
                                    serviceRequest.faults.length) *
                                  100
                                : 0,
                            color: "green",
                          },
                        ]}
                        size={80}
                        thickness={6}
                        label={
                          <Text align="center" color="green" weight="bold">
                            {numeral(
                              serviceRequest.faults.filter(
                                (fault: any) => fault.workOrderId
                              ).length / serviceRequest.faults.length
                            ).format("%")}
                          </Text>
                        }
                      />
                      <Text size="lg">
                        {
                          serviceRequest.faults.filter(
                            (fault: any) => fault.workOrderId
                          ).length
                        }{" "}
                        / {serviceRequest.faults.length} faults with work Order
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card
                  shadow="xs"
                  sx={(theme) => ({
                    backgroundColor: theme.colors.blue[8],
                    height: "100%",
                  })}
                >
                  <Group position="apart" mb={20}>
                    <Text
                      transform="uppercase"
                      color={theme.colors.gray[4]}
                      weight="bold"
                    >
                      Work Orders
                    </Text>
                    <Tool color={theme.colors.gray[4]} size={20} />
                  </Group>
                  <Grid>
                    <Grid.Col span={3}>
                      <Card sx={{ backgroundColor: "transparent" }}>
                        <Title sx={{ color: "white" }} align="center">
                          {serviceRequest.WorkOrders.length}
                        </Title>
                        <Text align="center" color="white">
                          Work{" "}
                          {serviceRequest.WorkOrders.length > 1
                            ? "Orders"
                            : "Order"}
                        </Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Card>
                        <Title
                          sx={(theme) => ({
                            color: theme.colors.blue[8],
                          })}
                          align="center"
                        >
                          {
                            serviceRequest.WorkOrders.filter(
                              (wo: any) => wo.status === "pending"
                            ).length
                          }
                        </Title>
                        <Text align="center" color={theme.colors.blue[8]}>
                          Pending
                        </Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Card>
                        <Title
                          sx={(theme) => ({
                            color: theme.colors.blue[8],
                          })}
                          align="center"
                        >
                          {
                            serviceRequest.WorkOrders.filter(
                              (wo: any) => wo.status === "in-progress"
                            ).length
                          }
                        </Title>
                        <Text align="center" color={theme.colors.blue[8]}>
                          In Progress
                        </Text>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Card>
                        <Title
                          sx={(theme) => ({
                            color: theme.colors.blue[8],
                          })}
                          align="center"
                        >
                          {
                            serviceRequest.WorkOrders.filter(
                              (wo: any) => wo.status === "completed"
                            ).length
                          }
                        </Title>
                        <Text align="center" color={theme.colors.blue[8]}>
                          Completed
                        </Text>
                      </Card>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}

export default ViewServiceRequest;
