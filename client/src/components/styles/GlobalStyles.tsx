import { Global } from "@mantine/core";

const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },

        body: {
          ...theme.fn.fontStyles(),
          lineHeight: theme.lineHeight,
          margin: 0,
          backgroundColor: theme.colors.gray[0],
          overflowX: "hidden",
          [`@media print`]: {
            backgroundColor: theme.white,
          },
        },
      })}
    />
  );
};

export default GlobalStyles;
