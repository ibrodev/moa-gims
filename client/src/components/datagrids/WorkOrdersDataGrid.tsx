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
import { useNavigate } from "react-router-dom";

const WorkOrdersDataGrid = ({ newWorkOrder, setActionDrawer }: any) => {
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
      // onConfirm: () => handleServiceRequestAccept(data.id),
    });

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
            "#SR Id": workOrder.serviceRequestId,
            Inspector: `${workOrder.ServiceRequest?.Employee?.firstName} ${workOrder.ServiceRequest?.Employee?.lastName}`,
            inspectorId: workOrder.ServiceRequest?.inspectorId,
            "Start Date": workOrder.startDate,
            "End Date": workOrder.endDate,
            "Work Department": workOrder.workDepartment,
            Expert: `${workOrder.Employee?.firstName} ${workOrder.Employee?.lastName}`,
            expertId: workOrder.Employee.id,
            "Created At": workOrder.createdAt,
          };
        })
        .filter((workOrder: any) => {
          if (auth.userRole === "recorder") return workOrder.endDate !== null;

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

              if (key === "Start Date" || key === "End Date")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }: any) =>
                    value ? moment(value).calendar() : value,
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
              return { Header: key === "id" ? "#WO id" : key, accessor: key };
            })
            .filter((key) => key.Header !== "inspectorId")
            .filter((key) => key.Header !== "expertId")
        : [],
    [workOrders]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }) => (
          <Group spacing="sm">
            <Tooltip label="View work order" withArrow>
              <ActionIcon
                variant="transparent"
                color="green"
                onClick={() =>
                  navigate(`./${row.values.id}`, { replace: true })
                }
              >
                <Eye size={18} />
              </ActionIcon>
            </Tooltip>
            {auth.userRole === "inspector" &&
            row.values["Start Date"] === null ? (
              <>
                <Tooltip label="More Options" withArrow>
                  <Menu position="bottom" placement="end" gutter={-6} withArrow>
                    <Menu.Item
                      icon={<Pencil size={18} />}
                      onClick={() =>
                        setActionDrawer({
                          opened: true,
                          data: row.original,
                          action: "update",
                          title: "Update Work Order",
                        })
                      }
                    >
                      Update work order
                    </Menu.Item>
                    <Menu.Item
                      icon={<Trash size={18} />}
                      color="red"
                      onClick={() => openDeleteModal(row.values.id)}
                    >
                      Delete work order
                    </Menu.Item>
                  </Menu>
                </Tooltip>
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

  if (workOrders?.length === 0)
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
