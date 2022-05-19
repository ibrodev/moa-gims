import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Menu,
  Modal,
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
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  MoodSad,
  Pencil,
  Selector,
  Trash,
} from "tabler-icons-react";
import moment from "moment";
import useTableComponent from "../ui/table";
import DataGridGlobalFilter from "./DataGridGlobalFilter";
import { showNotification } from "@mantine/notifications";
import useEmployeesService from "../../hooks/services/useEmployeesService";
import DataGridPagination from "./DataGridPagination";
import DataGridSetPageSize from "./DataGridSetPageSize";

const EmployeeDataGrid = ({ newEmployee, setActionDrawer }: any) => {
  const [employees, setEmployees] = useState([]);
  const [deleted, setDeleted] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState({
    opened: false,
    id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAll, destroy } = useEmployeesService();
  const Table = useTableComponent();

  const handleEmployeeDelete = async () => {
    try {
      await destroy(deleteEmployee.id);
      setDeleted(deleteEmployee.id);

      showNotification({
        title: "Employee Deleted",
        message: `Employee with id ${deleted} deleted successfully`,
        icon: <Check size={18} />,
      });
      setDeleteEmployee({ opened: false, id: null });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const employees = await getAll();
      const filteredEmployees = employees.map((employee: any) => {
        return {
          id: employee.id,
          "First Name": employee.firstName || "-",
          "Last Name": employee.lastName || "-",
          positionId: employee.positionId,
          Position: employee.Position?.name,
          "Created At": employee.createdAt,
        };
      });

      setEmployees(filteredEmployees);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [newEmployee, deleted]);

  const data = useMemo(() => [...employees], [employees]);
  const columns: Array<Column> = useMemo(
    () =>
      employees[0]
        ? Object.keys(employees[0])
            .map((key) => {
              if (key === "Created At")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }: any) => moment(value).fromNow(),
                };
              return { Header: key === "id" ? "#id" : key, accessor: key };
            })
            .filter((column) => column.Header !== "positionId")
        : [],
    [employees]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }) => (
          <Group spacing="sm">
            <Tooltip label="edit employee" withArrow color="blue">
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() =>
                  setActionDrawer({
                    opened: true,
                    title: "Update Employee Form",
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
                icon={<Trash size={18} />}
                color="red"
                onClick={() =>
                  setDeleteEmployee({ opened: true, id: row.values.id })
                }
              >
                Delete Employee
              </Menu.Item>
            </Menu>
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
        <Text color="gray">Loading employees</Text>{" "}
        <Loader variant="dots" size={50} />{" "}
      </Box>
    );

  if (error)
    return (
      <Box>
        <AlertTriangle /> <Text>{error}</Text>
      </Box>
    );

  if (employees?.length === 0)
    return (
      <Box>
        <MoodSad /> <Text>No employee found</Text>
      </Box>
    );

  return (
    <>
      <Modal
        centered
        size="sm"
        opened={deleteEmployee.opened}
        onClose={() =>
          setDeleteEmployee((prev) => ({ ...prev, opened: false }))
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
            You are about to delete an employee
          </Title>
          <Text>This will permanently delete the employee</Text>
          <Text>Are you sure?</Text>
        </Box>
        <Group spacing="xs" position="right">
          <Button
            variant="subtle"
            color="dark"
            onClick={() =>
              setDeleteEmployee((prev) => ({ ...prev, opened: false }))
            }
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleEmployeeDelete}>
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
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )
                          ) : (
                            <Selector size={18} />
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
          {page.map((row) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => {
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

export default EmployeeDataGrid;
