import { ActionIcon, Group, NumberInput, Text } from "@mantine/core";
import { Row } from "react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "tabler-icons-react";

interface DataGridPaginationProps {
  gotoPage: (pageIndex: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
  pageOptions: number[];
}

function DataGridPagination({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
}: DataGridPaginationProps) {
  return (
    <Group position="apart" style={{ marginTop: 10 }}>
      <Group spacing="xs">
        <Text>Go to page</Text>
        <NumberInput
          defaultValue={pageIndex + 1}
          onChange={(val: any) => gotoPage(parseInt(val) - 1)}
          size="xs"
          radius="xs"
        />
      </Group>
      <Group spacing="xs">
        <Text>
          Page {pageIndex + 1} of {pageOptions.length}
        </Text>
        <Group spacing="xs">
          <ActionIcon
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            color="blue"
            size="sm"
            radius="xs"
          >
            <ChevronsLeft />
          </ActionIcon>
          <ActionIcon
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            color="blue"
            size="sm"
            radius="xs"
          >
            <ChevronLeft />
          </ActionIcon>
          <ActionIcon
            onClick={() => nextPage()}
            disabled={!canNextPage}
            color="blue"
            size="sm"
            radius="xs"
          >
            <ChevronRight />
          </ActionIcon>
          <ActionIcon
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            color="blue"
            size="sm"
            radius="xs"
          >
            <ChevronsRight />
          </ActionIcon>
        </Group>
      </Group>
    </Group>
  );
}

export default DataGridPagination;
