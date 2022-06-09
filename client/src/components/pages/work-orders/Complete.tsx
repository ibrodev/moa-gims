import { Group } from "@mantine/core";
import { Title } from "@mantine/core";
import { Text } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { Button } from "@mantine/core";
import { InputWrapper } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Box } from "@mantine/core";
import { Textarea } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, Plus, X } from "tabler-icons-react";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";

function Complete({ workOrder, setUpdate, closeModal }: any) {
  const [completing, setCompleting] = useState(false);

  const { setComplete } = useWorkOrdersService();

  const form = useForm({
    initialValues: {
      serviceCost: 0,
      tasks: formList([{ description: "", labourCost: 0 }]),
    },
    validate: {
      serviceCost: (value) =>
        workOrder.serviceType === "out-source" && value <= 0.0
          ? "Service cost must be greater than 0.0"
          : null,
      tasks: {
        labourCost: (value) =>
          value < 0 ? "Negative values are not allowed for labour cost" : null,
      },
    },
  });

  const fields = form.values.tasks.map((item: any, i: number) => (
    <Group key={i} sx={{ alignItems: "flex-start" }}>
      <Box
        sx={{
          alignSelf: "flex-end",
          width: 28,
          height: 43.6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title
          order={4}
          sx={(theme) => ({
            color: theme.colors.gray[4],
            fontWeight: "normal",
            width: "max-content",
          })}
        >
          {i + 1}
        </Title>
      </Box>
      <Textarea
        required
        label="Task Description"
        placeholder="Task Description"
        autosize
        minRows={1}
        maxRows={1}
        {...form.getListInputProps("tasks", i, "description")}
        sx={{ flexGrow: 8 }}
      />
      <NumberInput
        hideControls
        placeholder="Labour Cost"
        label="Labour Cost"
        precision={2}
        {...form.getListInputProps("tasks", i, "labourCost")}
        icon={<Text color="dimmed">Birr</Text>}
        sx={{ flexGrow: 1 }}
        size="md"
      />
      <InputWrapper label=" " sx={{ alignSelf: "center" }}>
        <ActionIcon
          sx={{ visibility: i === 0 ? "hidden" : "visible" }}
          color="red"
          variant="transparent"
          onClick={() => form.removeListItem("tasks", i)}
        >
          <Tooltip label="Remove row">
            <X size={20} />
          </Tooltip>
        </ActionIcon>
      </InputWrapper>
    </Group>
  ));

  const handleFormSubmit = async (values: any) => {
    try {
      setCompleting(true);
      await setComplete(workOrder.id, values);
      showNotification({
        title: "Work order completed",
        message: `Work order completed successfully`,
        icon: <Check size={18} />,
      });
      setUpdate();
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <form
        onSubmit={form.onSubmit((values) => handleFormSubmit(values))}
        style={{ width: "90%" }}
      >
        <Group>
          <Box
            sx={{
              alignSelf: "flex-end",
              width: 28,
              height: 43.6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Box>
          {workOrder.serviceType === "out-source" && (
            <NumberInput
              required
              hideControls
              placeholder="Service Cost"
              label="Service Cost"
              precision={2}
              {...form.getInputProps("serviceCost")}
              icon={<Text color="dimmed">Birr</Text>}
              sx={{ flexGrow: 0, width: "30%" }}
              size="md"
              tabIndex={0}
            />
          )}
        </Group>
        {fields}
        <Group>
          <Tooltip label="Add a row" withArrow mt={15}>
            <ActionIcon
              color="blue"
              variant="transparent"
              onClick={() =>
                form.addListItem("tasks", {
                  description: "",
                  labourCost: 0,
                })
              }
            >
              <Plus size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group position="right" mt={20} mb={10}>
          <Button onClick={() => closeModal()} variant="default">
            Cancel
          </Button>
          <Button type="submit" loading={completing}>
            Complete Work Order
          </Button>
          <Box sx={{ width: 28 }}></Box>
        </Group>
      </form>
    </Box>
  );
}

export default Complete;
