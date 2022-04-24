import { createStyles } from "@mantine/core";

const useStyle = createStyles((theme) => ({
  container: {
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[3]}`,
    marginTop: theme.spacing.xs,
  },

  header: {
    backgroundColor: theme.fn.rgba(theme.colors.blue[4], 0.2),
  },

  cellHeading: {
    color: theme.colors.blue[7] + " !important",

    "& button": {
      fontWeight: "600",
      color: "inherit",
    },
  },
}));

export default useStyle;
