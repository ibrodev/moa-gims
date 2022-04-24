import React from "react";
import { Table as MTable } from "@mantine/core";
import useStyle from "./useStyle";

interface ChildrenProps {
  children: React.ReactNode;
  props?: React.ReactPropTypes;
}

const useTable = () => {
  const { classes } = useStyle();

  const Container = ({ children, ...props }: ChildrenProps) => (
    <MTable
      {...props}
      className={classes.container}
      highlightOnHover
      verticalSpacing="sm"
      striped
    >
      {children}
    </MTable>
  );
  const Header = ({ children, ...props }: ChildrenProps) => (
    <thead {...props} className={classes.header}>
      {children}
    </thead>
  );
  const Body = ({ children, ...props }: ChildrenProps) => (
    <tbody {...props}>{children}</tbody>
  );
  const Footer = ({ children, ...props }: ChildrenProps) => (
    <tfoot {...props}>{children}</tfoot>
  );
  const Row = ({ children, ...props }: ChildrenProps) => (
    <tr {...props}>{children}</tr>
  );
  const Cell = ({ children, ...props }: ChildrenProps) => (
    <td {...props}>{children}</td>
  );
  const CellHeading = ({ children, ...props }: ChildrenProps) => (
    <th {...props} className={classes.cellHeading}>
      {children}
    </th>
  );

  return {
    Container,
    Header,
    Body,
    Footer,
    Row,
    Cell,
    CellHeading,
  };
};

export default useTable;
