import { Select } from "@mantine/core";

interface DataGridSetPageSizeProps {
  setPageSize: (pageSize: number) => void;
  pageSize: string;
}

function DataGridSetPageSize({
  pageSize,
  setPageSize,
}: DataGridSetPageSizeProps) {
  return (
    <Select
      value={pageSize}
      data={[10, 20, 30, 40, 50].map((pageSize) => ({
        value: `${pageSize}`,
        label: `Show ${pageSize} records per page`,
      }))}
      onChange={() => setPageSize(Number(pageSize))}
      size="md"
    />
  );
}

export default DataGridSetPageSize;
