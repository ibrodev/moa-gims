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
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Eye,
  MoodSad,
  Pencil,
  PlaylistAdd,
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
import useWorkOrdersService from "../../hooks/services/useWorkOrdersService";
import { Link, useNavigate } from "react-router-dom";

const WorkOrdersDataGrid = ({ newWorkOrder }: any) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [deleted, setDeleted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAll, destroy, update } = useWorkOrdersService();

  const { auth } = useAuth();
  const modals = useModals();
  const navigate = useNavigate();

  const openDeleteModal = (id: number) => {
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
          Delete Work Order {id}
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
        confirm: loading ? "Deleting..." : "Delete",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red", loading },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleWorkOrderDelete(id, deleteModalId),
    });

    return deleteModalId;
  };

  const Table = useTableComponent();

  const handleWorkOrderDelete = async (workOrderId: any, modalId: any) => {
    try {
      setLoading(true);
      await destroy(workOrderId);
      setDeleted(workOrderId);

      modals.closeModal(modalId);

      showNotification({
        title: "Work Order Deleted",
        message: `Work Order with id ${workOrderId} deleted successfully`,
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const workOrders = await getAll();
      const filteredWorkOrders = workOrders
        .map((workOrder: any) => {
          return {
            id: workOrder.id,
            "#WO Number": `${workOrder.type === "project" ? "P" : "R"}/${
              workOrder.id
            }/${moment(workOrder.createdAt).year()}`,
            "#SR Number": workOrder.serviceRequestId,
            "Service Type": workOrder.serviceType,
            Inspector: `${workOrder.ServiceRequest?.Employee?.firstName} ${workOrder.ServiceRequest?.Employee?.lastName}`,
            inspectorId: workOrder.ServiceRequest?.inspectorId,
            expertId: workOrder.Employee?.id,
            Status: workOrder.status,
            "Created At": workOrder.createdAt,
          };
        })
        .filter((workOrder: any) => {
          if (auth.userRole === "inspector")
            return workOrder.inspectorId === auth.user.employeeId;

          return true;
        });

      setWorkOrders(filteredWorkOrders);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [newWorkOrder, deleted]);

  const data = useMemo(() => [...workOrders], [workOrders]);
  const columns: Array<Column> = useMemo(
    () =>
      workOrders[0]
        ? Object.keys(workOrders[0])
            .map((key) => {
              if (key === "Created At")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }: any) => moment(value).fromNow(),
                };
              return { Header: key, accessor: key };
            })
            .filter((key) => key.Header !== "inspectorId")
            .filter((key) => key.Header !== "expertId")
            .filter((key) => key.Header !== "id")
        : [],
    [workOrders]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }: any) => (
          <Group spacing="sm">
            <Tooltip label="View work order" withArrow>
              <ActionIcon
                component={Link}
                to={`/work-orders/${row.original.id}`}
                variant="transparent"
              >
                <Eye size={18} color="blue" />
              </ActionIcon>
            </Tooltip>
            {row.values.Status === "pending" &&
              auth.userRole === "inspector" &&
              auth.user.employeeId === row.original.inspectorId && (
                <Tooltip label="Delete work order" withArrow>
                  <ActionIcon
                    variant="transparent"
                    onClick={() => openDeleteModal(row.original.id)}
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

  if (workOrders?.length === 0)
    return (
      <Box>
        <MoodSad /> <Text>No work order found</Text>
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

export default WorkOrdersDataGrid;
