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
  Eye,
  MoodSad,
  Pencil,
  Replace,
  Select,
  Selector,
  Trash,
} from "tabler-icons-react";
import moment from "moment";
import useUsersService from "../../hooks/services/useUsersService";
import useTableComponent from "../ui/table";
import DataGridGlobalFilter from "./DataGridGlobalFilter";
import { showNotification } from "@mantine/notifications";
import DataGridSetPageSize from "./DataGridSetPageSize";
import DataGridPagination from "./DataGridPagination";

const UsersDataGrid = ({ newUser, setActionDrawer }: any) => {
  const [users, setUsers] = useState([]);
  const [deleted, setDeleted] = useState(null);
  const [deleteUser, setDeleteUser] = useState({ opened: false, id: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAll, destroy } = useUsersService();
  const Table = useTableComponent();

  const handleUserDelete = async () => {
    try {
      await destroy(deleteUser.id);
      setDeleted(deleteUser.id);

      showNotification({
        title: "User Deleted",
        message: `User with id ${deleted} deleted successfully`,
        icon: <Check size={18} />,
      });
      setDeleteUser({ opened: false, id: null });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await getAll();
      const filteredUsers = users.map((user: any) => {
        return {
          id: user.id,
          "First Name": user.Employee?.firstName || "-",
          "Last Name": user.Employee?.lastName || "-",
          Username: user.username,
          Role: user.role,
          employeeId: user.employeeId,
          "Created At": user.createdAt,
        };
      });

      setUsers(filteredUsers);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [newUser, deleted]);

  const data = useMemo(() => [...users], [users]);
  const columns: Array<Column> = useMemo(
    () =>
      users[0]
        ? Object.keys(users[0])
            .map((key) => {
              if (key === "Created At")
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }: any) => moment(value).fromNow(),
                };
              return { Header: key === "id" ? "#id" : key, accessor: key };
            })
            .filter((column) => column.Header !== "employeeId")
        : [],
    [users]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }) => (
          <Group spacing="sx">
            <Tooltip label="edit user" withArrow color="blue">
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() =>
                  setActionDrawer({
                    opened: true,
                    title: "Update User Form",
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
                icon={<Replace size={18} />}
                onClick={() =>
                  setActionDrawer({
                    opened: true,
                    title: "Password Reset Form",
                    action: "passwordReset",
                    data: row.original,
                  })
                }
              >
                Reset Password
              </Menu.Item>
              <Menu.Item
                icon={<Trash size={18} />}
                color="red"
                onClick={() =>
                  setDeleteUser({ opened: true, id: row.values.id })
                }
              >
                Delete User
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

  useEffect(() => {
    fetchUsers();
  }, []);

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

  if (users?.length === 0)
    return (
      <Box>
        <MoodSad /> <Text>No user found</Text>
      </Box>
    );

  return (
    <>
      <Modal
        centered
        size="sm"
        opened={deleteUser.opened}
        onClose={() => setDeleteUser((prev) => ({ ...prev, opened: false }))}
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
            You are about to delete a user
          </Title>
          <Text>This will permanently delete the user</Text>
          <Text>Are you sure?</Text>
        </Box>
        <Group spacing="xs" position="right">
          <Button
            variant="subtle"
            color="dark"
            onClick={() =>
              setDeleteUser((prev) => ({ ...prev, opened: false }))
            }
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleUserDelete}>
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

export default UsersDataGrid;
