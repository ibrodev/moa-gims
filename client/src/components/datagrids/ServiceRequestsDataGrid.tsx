import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
  Column,
  Hooks,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  MoodSad,
  Selector,
  Trash,
} from "tabler-icons-react";
import moment from "moment";
import useTableComponent from "../ui/table";
import DataGridGlobalFilter from "./DataGridGlobalFilter";
import { showNotification } from "@mantine/notifications";
import useServiceRequestsService from "../../hooks/services/useServiceRequestsService";
import useAuth from "../../hooks/useAuth";
import { useModals } from "@mantine/modals";
import DataGridPagination from "./DataGridPagination";
import DataGridSetPageSize from "./DataGridSetPageSize";
import { Link, useNavigate } from "react-router-dom";
// import { toEthiopianDateString } from "gc-to-ethiopian-calendar";

const ServiceRequestsDataGrid = ({
  newServiceRequest,
  setActionDrawer,
}: any) => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [crudAction, setCrudAction] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { getAll, destroy } = useServiceRequestsService();

  const { auth } = useAuth();
  const navigate = useNavigate();
  const modals = useModals();

  const Table = useTableComponent();

  const deleteModal = (id: number) => {
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
          Delete Service Request {id}
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
      onConfirm: () => handleServiceRequestDelete(id, deleteModalId),
    });
  };

  const handleServiceRequestDelete = async (id: number, modalId: any) => {
    try {
      setDeleting(true);
      await destroy(id);
      setCrudAction(Math.random());

      modals.closeModal(modalId);

      showNotification({
        title: "Service Request Deleted",
        message: `Service Request with id ${id} deleted successfully`,
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
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
            Department: serviceRequest.Department?.name,
            Driver: `${serviceRequest.Driver?.firstName} ${serviceRequest.Driver?.lastName}`,
            Status:
              serviceRequest.status === "submitted" &&
              auth.userRole === "team-leader"
                ? "Received"
                : serviceRequest.status,
            "Created At": serviceRequest.createdAt,
            inspectorId: serviceRequest.inspectorId,
            vehicleId: serviceRequest.vehicleId,
            driverId: serviceRequest.driverId,
            departmentId: serviceRequest.departmentId,
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
  }, [newServiceRequest, crudAction]);

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
                  // Cell: ({ value }: any) => toEthiopianDateString(value),
                };

              return {
                Header: key === "id" ? "#SR Number" : key,
                accessor: key,
              };
            })
            .filter((column) => column.Header !== "inspectorId")
            .filter((column) => column.Header !== "vehicleId")
            .filter((column) => column.Header !== "driverId")
            .filter((column) => column.Header !== "departmentId")
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
          <Group spacing="xs">
            <Tooltip label="View Service Request" withArrow>
              <ActionIcon
                component={Link}
                to={`/service-requests/${row.values.id}`}
                variant="transparent"
              >
                <Eye size={18} color="blue" />
              </ActionIcon>
            </Tooltip>
            {auth.userRole === "recorder" && row.values.Status === "draft" && (
              <Tooltip label="Delete Service Request" withArrow>
                <ActionIcon
                  variant="transparent"
                  onClick={() => deleteModal(row.values.id)}
                >
                  <Trash size={18} color="red" />
                </ActionIcon>
              </Tooltip>
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
        <Text color="gray">Loading Service Requests</Text>{" "}
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
                {row.cells.map((cell: any) => {
                  return (
                    <Table.Cell {...cell.getCellProps()}>
                      {cell.render("Cell")}
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
