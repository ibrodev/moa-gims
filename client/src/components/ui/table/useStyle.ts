import { createStyles } from "@mantine/core";

const useStyle = createStyles((theme) => ({
  container: {
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[3]}`,
    marginTop: theme.spacing.xs,
    width: "100%",
    minWidth: "max-content",
  },

  header: {
    backgroundColor: theme.fn.rgba(theme.colors.blue[4], 0.2),
  },

  cellHeading: {
    color: theme.colors.blue[7] + " !important",
    width: "max-content",
    "& button": {
      color: "inherit",
      display: "flex",
      width: "100%",
      "&  div": {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-around",
        width: "100%",
        minWidth: "max-content",
      },
    },
  },

  cell: {
    width: "max-content",
    maxWidth: "300px",
  },
}));

export default useStyle;
