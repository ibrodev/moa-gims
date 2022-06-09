import {
  Box,
  Button,
  Drawer,
  Group,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Plus, UserPlus } from "tabler-icons-react";
import DocumentTitleContext from "../../../contexts/DocumentTitleProvider";
import useAuth from "../../../hooks/useAuth";
import PositionsDataGrid from "../../datagrids/PositionsDataGrid";
import CreatePosition from "./CreatePositions";
import UpdatePosition from "./UpdatePositions";

function Positions() {
  const theme = useMantineTheme();
  const { auth } = useAuth();

  const [actionDrawer, setActionDrawer] = useState({
    opened: false,
    title: "",
    action: "",
    data: {},
  });
  const [newPosition, setNewPosition] = useState(null);

  const { setTitle } = useContext(DocumentTitleContext);

  useEffect(() => {
    setTitle((prev: any) => ({ ...prev, pageTitle: "Positions" }));
  }, []);

  if (auth?.userRole !== "admin")
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Title order={1}> Unauthorized </Title>
      </Box>
    );

  return (
    <>
      <Drawer
        opened={actionDrawer.opened}
        onClose={() => setActionDrawer((prev) => ({ ...prev, opened: false }))}
        title={actionDrawer.title}
        padding="xl"
        size="xl"
        position="right"
        lockScroll={true}
      >
        {actionDrawer.opened &&
          (actionDrawer.action === "create" ? (
            <CreatePosition setNewPosition={setNewPosition} />
          ) : actionDrawer.action === "update" ? (
            <UpdatePosition
              setNewPosition={setNewPosition}
              data={actionDrawer.data}
              setActionDrawer={setActionDrawer}
            />
          ) : (
            <></>
          ))}
      </Drawer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title order={1} sx={{ color: theme.colors.gray[6], marginBottom: 32 }}>
          Positions
        </Title>
        <Group>
          <Button
            size="md"
            rightIcon={<Plus size={18} />}
            onClick={() =>
              setActionDrawer({
                opened: true,
                title: "New Position Form",
                action: "create",
                data: {},
              })
            }
          >
            Create Position
          </Button>
        </Group>
      </Box>
      <PositionsDataGrid
        newPosition={newPosition}
        setActionDrawer={setActionDrawer}
      />
    </>
  );
}

export default Positions;
