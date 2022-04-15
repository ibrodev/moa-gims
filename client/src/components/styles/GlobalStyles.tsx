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
        },
      })}
    />
  );
};

export default GlobalStyles;
