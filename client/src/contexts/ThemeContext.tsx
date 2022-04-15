import { MantineProvider } from "@mantine/core";
import React from "react";

interface childrenProp {
  children: React.ReactNode;
}

const ThemeContext = ({ children }: childrenProp) => {
  return (
    <MantineProvider
      theme={{
        fontFamily: "Source Sans Pro",
        headings: {
          fontFamily: "Source Sans Pro",
        },
      }}
    >
      {children}
    </MantineProvider>
  );
};

export default ThemeContext;
