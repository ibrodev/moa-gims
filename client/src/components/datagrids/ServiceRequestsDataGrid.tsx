import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  List,
  Loader,
  Menu,
  Modal,
  Select,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Column,
  Hooks,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  MoodSad,
  Pencil,
  Selector,
  Send,
  Trash,
  UserCheck,
} from "tabler-icons-react";
import moment from "moment";
import useTableComponent from "../ui/table";
import DataGridGlobalFilter from "./DataGridGlobalFilter";
import { showNotification } from "@mantine/notifications";
import useServiceRequestsService from "../../hooks/services/useServiceRequestsService";
import useAuth from "../../hooks/useAuth";
import { useModals } from "@mantine/modals";
import useEmployeesService from "../../hooks/services/useEmployeesService";
import { useForm } from "@mantine/form";
import DataGridPagination from "./DataGridPagination";
import DataGridSetPageSize from "./DataGridSetPageSize";

const ServiceRequestsDataGrid = ({
  newServiceRequest,
  setActionDrawer,
}: any) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [deleted, setDeleted] = useState(null);
  const [deleteServiceRequest, setDeleteServiceRequest] = useState({
    opened: false,
    id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAll, destroy, update, accept } = useServiceRequestsService();

  const { auth } = useAuth();
  const modals = useModals();

  const openSubmitModal = (id: number) =>
    modals.openConfirmModal({
      title: "Submit Service Request",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to submit this service request?
        </Text>
      ),
      labels: { confirm: "Submit Service Request", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => handleServiceRequestSubmit(id),
    });

  const openAcceptModal = (data: any) =>
    modals.openConfirmModal({
      title: "Accept Service Request",
      centered: true,
      children: (
        <>
          <Text mb={4}>
            Are you sure you want to accept this service request?
          </Text>
          {!data["Odometer Reading"] && (
            <Text size="sm" color="yellow">
              <Text size="xs" weight="700" transform="uppercase">
                Warning
              </Text>
              This SR Odometer Reading value is null, please make sure to update
              it latter otherwise odometer reading value will not be available
              for Work Orders which will be created under this SR
            </Text>
          )}
        </>
      ),
      labels: { confirm: "Accept Service Request", cancel: "Cancel" },
      onCancel: () => {},
      onConfirm: () => handleServiceRequestAccept(data.id),
    });

  const Table = useTableComponent();

  const handleServiceRequestAccept = async (id: any) => {
    try {
      await accept(id);
      setDeleted(id);
      showNotification({
        title: "Service Request Accepted",
        message: `Service Request with id ${deleted} accepted successfully`,
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleServiceRequestDelete = async () => {
    try {
      await destroy(deleteServiceRequest.id);
      setDeleted(deleteServiceRequest.id);

      showNotification({
        title: "Service Request Deleted",
        message: `Service Request with id ${deleted} deleted successfully`,
        icon: <Check size={18} />,
      });
      setDeleteServiceRequest({ opened: false, id: null });
    } catch (error) {
      console.log(error);
    }
  };

  const handleServiceRequestSubmit = async (serviceRequestId: any) => {
    try {
      await update(serviceRequestId, { status: "submitted" });
      setDeleted(serviceRequestId);
      showNotification({
        title: "Service Request Submitted",
        message: `Service Request with id ${deleted} submitted successfully`,
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const serviceRequests = await getAll();
      const filteredServiceRequests = serviceRequests
        .map((serviceRequest: any) => {
          return {
            id: serviceRequest.id,
            Vehicle: serviceRequest.Vehicle.plateNo,
            Department: serviceRequest.Department.name,
            Driver: `${serviceRequest.Driver?.firstName} ${serviceRequest.Driver?.lastName}`,
            DriverObj: serviceRequest.Driver,
            Faults: serviceRequest.Faults,
            inspectorId: serviceRequest.inspectorId,
            Inspector: serviceRequest.inspectorId
              ? `${serviceRequest.Employee?.firstName} ${serviceRequest.Employee?.lastName}`
              : "Unassigned",
            "Odometer Reading": serviceRequest.odometerReading,
            Status: serviceRequest.status,
            "Created At": serviceRequest.createdAt,
            DriverId: serviceRequest.Driver?.id,
            VehicleId: serviceRequest.Vehicle?.id,
            DepartmentId: serviceRequest.Department?.id,
          };
        })
        .filter((serviceRequest: any) => {
          if (auth.userRole === "recorder") return serviceRequest;
          if (auth.userRole === "team-leader")
            return serviceRequest.Status !== "draft";

          if (auth.userRole === "inspector") {
            if (
              !auth.user.employeeId ||
              auth.user.employeeId !== serviceRequest.inspectorId
            )
              return false;
            return serviceRequest;
          }

          return false;
        });

      setServiceRequests(filteredServiceRequests);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [newServiceRequest, deleted]);

  const data = useMemo(() => [...serviceRequests], [serviceRequests]);
  const columns: Array<Column> = useMemo(
    () =>
      serviceRequests[0]
        ? Object.keys(serviceRequests[0])
            .map((key) => {
              if (key === "Created At")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }: any) => moment(value).fromNow(),
                };

              if (key === "Faults")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }: any) => (
                    <List size="sm">
                      {value.map((problem: any) => (
                        <List.Item>{problem.description}</List.Item>
                      ))}
                    </List>
                  ),
                };
              return { Header: key === "id" ? "#SR id" : key, accessor: key };
            })
            .filter((column) => column.Header !== "DriverObj")
            .filter((column) => column.Header !== "inspectorId")
            .filter((column) => column.Header !== "DriverId")
            .filter((column) => column.Header !== "VehicleId")
            .filter((column) => column.Header !== "DepartmentId")
        : [],
    [serviceRequests]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }) => (
          <Group spacing="sx">
            {auth.userRole === "recorder" && row.values.Status === "draft" ? (
              <>
                <Tooltip label="edit" withArrow color="blue">
                  <ActionIcon
                    variant="transparent"
                    color="blue"
                    onClick={() =>
                      setActionDrawer({
                        opened: true,
                        title: "Update Service Request Form",
                        action: "update",
                        data: row.original,
                      })
                    }
                  >
                    <Pencil size={18} />
                  </ActionIcon>
                </Tooltip>
                <Menu position="bottom" placement="end" gutter={-6} withArrow>
                  <Menu.Item
                    icon={<Send size={18} />}
                    onClick={() => openSubmitModal(row.values.id)}
                  >
                    Submit Service Request
                  </Menu.Item>
                  <Menu.Item
                    icon={<Trash size={18} />}
                    color="red"
                    onClick={() =>
                      setDeleteServiceRequest({
                        opened: true,
                        id: row.values.id,
                      })
                    }
                  >
                    Delete Service Request
                  </Menu.Item>
                </Menu>
              </>
            ) : auth.userRole === "team-leader" &&
              row.values.Status === "submitted" ? (
              <Tooltip label="assign inspector" withArrow color="blue">
                <ActionIcon
                  variant="transparent"
                  color="blue"
                  onClick={() =>
                    setActionDrawer({
                      opened: true,
                      title: "Assign Inspector Form",
                      action: "assignInspector",
                      data: row.original,
                    })
                  }
                >
                  <UserCheck size={18} />
                </ActionIcon>
              </Tooltip>
            ) : auth.userRole === "inspector" ? (
              <>
                <Tooltip label="update odometer reading" withArrow color="blue">
                  <ActionIcon
                    variant="transparent"
                    color="blue"
                    onClick={() =>
                      setActionDrawer({
                        opened: true,
                        title: "Update Odometer Reading Form",
                        action: "updateOdometerReading",
                        data: row.original,
                      })
                    }
                  >
                    <Pencil size={18} />
                  </ActionIcon>
                </Tooltip>
                {row.values.Status !== "accepted" && (
                  <Tooltip label="accept this SR" withArrow color="blue">
                    <ActionIcon
                      variant="transparent"
                      color="blue"
                      onClick={() => openAcceptModal(row.values)}
                    >
                      <Check size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </>
            ) : (
              <></>
            )}
          </Group>
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    tableHooks,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    preGlobalFilteredFlatRows,
    setGlobalFilter,

    // pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = tableInstance;

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

  if (error)
    return (
      <Box>
        <AlertTriangle /> <Text>{error}</Text>
      </Box>
    );

  if (serviceRequests?.length === 0)
    return (
      <Box>
        <MoodSad /> <Text>No service request found</Text>
      </Box>
    );

  return (
    <>
      <Modal
        centered
        size="sm"
        opened={deleteServiceRequest.opened}
        onClose={() =>
          setDeleteServiceRequest((prev) => ({ ...prev, opened: false }))
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          mb={40}
        >
          <Trash size={30} color="red" />
          <Title order={4} style={{ color: "red" }} mt={4}>
            You are about to delete a service request
          </Title>
          <Text>This will permanently delete the service request</Text>
          <Text>Are you sure?</Text>
        </Box>
        <Group spacing="xs" position="right">
          <Button
            variant="subtle"
            color="dark"
            onClick={() =>
              setDeleteServiceRequest((prev) => ({ ...prev, opened: false }))
            }
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleServiceRequestDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
      <Group>
        <DataGridGlobalFilter
          preGlobalFilteredRows={preGlobalFilteredFlatRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <DataGridSetPageSize
          pageSize={`${state.pageSize}`}
          setPageSize={setPageSize}
        />
      </Group>

      <Table.Container {...getTableProps()}>
        <Table.Header>
          {headerGroups.map((headerGroup) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Table.CellHeading
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <UnstyledButton>
                    <Group>
                      <Text>{column.render("Header")}</Text>
                      <Center>
                        {column.id !== "Actions" ? (
                          column.isSorted ? (
                            column.isSortedDesc ? (
                              <ChevronUp size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )
                          ) : (
                            <Selector size={15} />
                          )
                        ) : null}
                      </Center>
                    </Group>
                  </UnstyledButton>
                </Table.CellHeading>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
                {/* {console.log(row.original)} */}
                {row.cells.map((cell: any) => {
                  // console.log(cell.value);

                  return (
                    <Table.Cell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                      {cell.column.Header === "Driver" && (
                        <Text size="xs" color="dark">
                          {row.original.DriverObj.licenseNo}
                        </Text>
                      )}
                      {cell.column.Header === "Odometer Reading" &&
                        !!cell.value && (
                          <Text
                            size="xs"
                            style={{ display: "inline", marginLeft: 2 }}
                          >
                            Km
                          </Text>
                        )}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Container>
      <DataGridPagination
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        pageIndex={state.pageIndex}
      />
    </>
  );
};

export default ServiceRequestsDataGrid;
