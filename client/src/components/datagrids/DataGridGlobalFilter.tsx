/* eslint-disable react-hooks/rules-of-hooks */
import { ActionIcon, TextInput, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { useAsyncDebounce, UseGlobalFiltersInstanceProps } from "react-table";
import { ArrowRight, Search } from "tabler-icons-react";

const DataGridGlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) => {
  const theme = useMantineTheme();
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 300);

  return (
    <>
      <TextInput
        icon={<Search size={18} />}
        size="md"
        placeholder="Search any column"
        rightSectionWidth={42}
        value={value || ""}
        onChange={(e: any) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{ maxWidth: "400px" }}
      />
    </>
  );
};

export default DataGridGlobalFilter;
