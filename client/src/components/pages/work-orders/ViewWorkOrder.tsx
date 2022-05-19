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
import { Link, useParams } from "react-router-dom";
import {
  ArrowNarrowLeft,
  Check,
  DotsVertical,
  Trash,
} from "tabler-icons-react";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";
import useAuth from "../../../hooks/useAuth";
import SetEndDate from "./SetEndDate";
import SetStartDate from "./SetStartDate";
import momunt from "moment";

interface modalI {
  opened: boolean;
  title: string;
  content: React.ReactElement | null;
}

function ViewWorkOrder() {
  const [loading, setLoading] = useState(true);
  const [workOrder, setWorkOrder] = useState<any>({});
  const [newFault, setNewFault] = useState("");
  const [updatingFaults, setUpdatingFaults] = useState(false);
  const [update, setUpdate] = useState("");
  const [modal, setModal] = useState<modalI>({
    opened: false,
    title: "",
    content: null,
  });

  const theme = useMantineTheme();
  const params = useParams();
  const { auth } = useAuth();

  const form = useForm({
    initialValues: {
      additionalFaults: formList<any>([]),
    },
  });

  const { getOne, addFaults } = useWorkOrdersService();

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

  const handleAddListItem = () => {
    form.addListItem("additionalFaults", {
      description: newFault,
      type: "additional",
    });
    setNewFault("");
  };

  const updateFaults = async () => {
    try {
      setUpdatingFaults(true);
      await addFaults(params.id, form.values.additionalFaults);
      form.reset();
      setUpdate("updated");
      showNotification({
        title: "Work Order Faults Updated",
        message: `Work Order with id ${params.id} updated successfully`,
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingFaults(false);
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
    workOrder.ServiceRequest?.inspectorId !== auth.user.employeeId
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

          <Group>
            {!!workOrder.endDate || (
              <Button
                onClick={() =>
                  setModal({
                    opened: true,
                    title: "Set Start Date",
                    content: (
                      <SetStartDate
                        workOrder={workOrder}
                        closeModal={() =>
                          setModal((prev) => ({ ...prev, opened: false }))
                        }
                        setUpdate={setUpdate}
                      />
                    ),
                  })
                }
              >
                {workOrder.startDate ? "Update Start Date" : "Set Start Date"}
              </Button>
            )}

            {workOrder.startDate && (
              <Button
                onClick={() =>
                  setModal({
                    opened: true,
                    title: "Set End Date",
                    content: (
                      <SetEndDate
                        workOrder={workOrder}
                        closeModal={() =>
                          setModal((prev) => ({ ...prev, opened: false }))
                        }
                        setUpdate={setUpdate}
                      />
                    ),
                  })
                }
              >
                {workOrder.endDate ? "Update End Date" : "Set End Date"}
              </Button>
            )}
            <Button>Register Spare Parts</Button>

            <Menu
              control={
                <ActionIcon variant="filled" size="lg" color="blue">
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
          </Group>
        </Group>
        <SimpleGrid cols={2} spacing="md">
          <Card>
            <Card.Section>
              <Title
                order={5}
                sx={{ padding: "10px 16px", color: theme.colors.gray[6] }}
              >
                Work Order Details
              </Title>
              <Divider />
            </Card.Section>
            <Stack
              align="flex-start"
              justify="flex-start"
              spacing="xs"
              sx={{ marginTop: 10 }}
            >
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Work Order Number (WON)</Text>
                <Text weight={600}>{workOrder.id}</Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Vehicle Plate No</Text>
                <Text weight={600}>
                  {workOrder.ServiceRequest?.Vehicle?.plateNo}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Work Type</Text>
                <Text weight={600}>{workOrder.workType}</Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Driver</Text>
                <Text weight={600}>
                  {workOrder.ServiceRequest?.Driver?.firstName}{" "}
                  {workOrder.ServiceRequest?.Driver?.lastName}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Inspector</Text>
                <Text weight={600}>
                  {workOrder.ServiceRequest?.Employee?.firstName}{" "}
                  {workOrder.ServiceRequest?.Employee?.lastName}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Assigned Expert</Text>
                <Text weight={600}>
                  {workOrder.Employee?.firstName} {workOrder.Employee?.lastName}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Odometer Reading</Text>
                <Text weight={600}>
                  {workOrder.ServiceRequest?.odometerReading || "-"}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Start Date</Text>
                <Text weight={600}>
                  {momunt(workOrder.startDate).format("MMM DD, YYYY") || "-"}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">End Date</Text>
                <Text weight={600}>
                  {momunt(workOrder.endDate).format("MMM D, YYYY") || "-"}
                </Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Service Type</Text>
                <Text weight={600}>{workOrder.serviceType || "-"}</Text>
              </Group>
              <Group position="apart" sx={{ width: "100%" }}>
                <Text size="sm">Service Cost</Text>
                <Text weight={600}>{workOrder.serviceCost || "-"}</Text>
              </Group>
            </Stack>
          </Card>
          <Card sx={{ height: "fit-content" }}>
            <Card.Section>
              <Title
                order={5}
                sx={{ padding: "10px 16px", color: theme.colors.gray[6] }}
              >
                Work Order Faults
              </Title>
              <Divider />
            </Card.Section>

            <Table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workOrder.Faults?.map((fault: any) => (
                  <tr key={fault.id}>
                    <td>{fault.description}</td>
                    <td>{fault.type}</td>
                    <td style={{ width: "10%" }}></td>
                  </tr>
                ))}
                {!workOrder.startDate &&
                  form.values.additionalFaults.map((_: any, index) => (
                    <tr key={index}>
                      <td>{_.description}</td>
                      <td>{_.type}</td>
                      <td>
                        <ActionIcon
                          variant="hover"
                          color="red"
                          onClick={() =>
                            form.removeListItem("additionalFaults", index)
                          }
                        >
                          <Trash size={18} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                {!workOrder.startDate && (
                  <tr>
                    <td colSpan={2}>
                      <TextInput
                        required
                        size="sm"
                        value={newFault}
                        onChange={(e: any) => setNewFault(e.target.value)}
                        placeholder="New fault description"
                        sx={{
                          "& .mantine-TextInput-input": {
                            padding: 0,
                            border: "none",
                          },
                        }}
                      />
                    </td>
                    <td>
                      <ActionIcon
                        variant="hover"
                        onClick={handleAddListItem}
                        disabled={!newFault}
                      >
                        <Check size={18} />
                      </ActionIcon>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {form.values.additionalFaults.length > 0 && (
              <Button
                sx={{ marginTop: 20 }}
                onClick={updateFaults}
                loading={updatingFaults}
              >
                Update Work Order Faults
              </Button>
            )}
          </Card>
        </SimpleGrid>
      </Container>
    </>
  );
}

export default ViewWorkOrder;
