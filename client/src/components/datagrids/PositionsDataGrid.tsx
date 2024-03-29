import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  Text,
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
  ChevronDown,
  ChevronUp,
  MoodSad,
  Pencil,
  Selector,
} from "tabler-icons-react";
import moment from "moment";
import useTableComponent from "../ui/table";
import DataGridGlobalFilter from "./DataGridGlobalFilter";
import usePositionsService from "../../hooks/services/usePositionsService";
import DataGridSetPageSize from "./DataGridSetPageSize";
import DataGridPagination from "./DataGridPagination";

const PositionsDataGrid = ({ newPosition, setActionDrawer }: any) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAll } = usePositionsService();
  const Table = useTableComponent();

  const fetchPositions = async () => {
    try {
      const positions = await getAll();
      const filteredPositions = positions.map((position: any) => {
        return {
          id: position.id,
          Name: position.name,
          "Created At": position.createdAt,
        };
      });

      setPositions(filteredPositions);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [newPosition]);

  const data = useMemo(() => [...positions], [positions]);
  const columns: Array<Column> = useMemo(
    () =>
      positions[0]
        ? Object.keys(positions[0]).map((key) => {
            if (key === "Created At")
              return {
                Header: key,
                accessor: key,
                Cell: ({ value }: any) => moment(value).fromNow(),
              };
            return { Header: key === "id" ? "#id" : key, accessor: key };
          })
        : [],
    [positions]
  );

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Actions",
        Header: "Actions",
        Cell: ({ row }) => (
          <Group spacing="sm">
            <Tooltip label="edit position" withArrow color="blue">
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() =>
                  setActionDrawer({
                    opened: true,
                    title: "Update Position Form",
                    action: "update",
                    data: row.original,
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
        <Text color="gray">Loading positions</Text>{" "}
        <Loader variant="dots" size={50} />{" "}
      </Box>
    );

  if (error)
    return (
      <Box>
        <AlertTriangle /> <Text>{error}</Text>
      </Box>
    );

  if (positions?.length === 0)
    return (
      <Box>
        <MoodSad /> <Text>No position found</Text>
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

export default PositionsDataGrid;
