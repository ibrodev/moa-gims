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
import useVehiclesService from "../../hooks/services/useVehiclesService";
import DataGridSetPageSize from "./DataGridSetPageSize";
import DataGridPagination from "./DataGridPagination";

const VehiclesDataGrid = ({ newVehicle, setActionDrawer }: any) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAll } = useVehiclesService();
  const Table = useTableComponent();

  const fetchVehicle = async () => {
    try {
      const vehicles = await getAll();
      const filteredVehicles = vehicles.map((vehicle: any) => {
        return {
          id: vehicle.id,
          "Plate No": vehicle.plateNo,
          Manufacturer: vehicle.manufacturer,
          Model: vehicle.model,
          "Engine No": vehicle.engineNo,
          "Engine Capacity": vehicle.engineCapacity,
          "Engine Type": vehicle.engineType,
          "Chassis No": vehicle.chassisNo,
          "Created At": vehicle.createdAt,
        };
      });

      setVehicles(filteredVehicles);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [newVehicle]);

  const data = useMemo(() => [...vehicles], [vehicles]);
  const columns: Array<Column> = useMemo(
    () =>
      vehicles[0]
        ? Object.keys(vehicles[0]).map((key) => {
            if (key === "Created At")
              return {
                Header: key,
                accessor: key,
                Cell: ({ value }: any) => moment(value).fromNow(),
              };
            return { Header: key === "id" ? "#id" : key, accessor: key };
          })
        : [],
    [vehicles]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }) => (
          <Group spacing="sm">
            <Tooltip label="edit vehicle" withArrow color="blue">
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() =>
                  setActionDrawer({
                    opened: true,
                    title: "Update Vehicle Form",
                    action: "update",
                    data: row.values,
                  })
                }
              >
                <Pencil size={18} />
              </ActionIcon>
            </Tooltip>
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

  if (vehicles?.length === 0)
    return (
      <Box>
        <MoodSad /> <Text>No user found</Text>
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

export default VehiclesDataGrid;
