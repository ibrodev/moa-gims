/* eslint-disable react-hooks/rules-of-hooks */
import { TextInput } from "@mantine/core";
import { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { Search } from "tabler-icons-react";

const DataGridGlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) => {
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
        style={{ width: "400px" }}
      />
    </>
  );
};

export default DataGridGlobalFilter;
