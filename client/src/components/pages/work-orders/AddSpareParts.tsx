import { TextInput } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { InputWrapper } from "@mantine/core";
import { Box } from "@mantine/core";
import { Button } from "@mantine/core";
import { Text } from "@mantine/core";
import { Title } from "@mantine/core";
import { Tooltip } from "@mantine/core";
import { NumberInputHandlers } from "@mantine/core";
import { Group } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useRef, useState } from "react";
import { Check, Minus, Plus, X } from "tabler-icons-react";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";

function AddSpareParts({ workOrder, closeModal }: any) {
  const [addingParts, setAddingParts] = useState(false);
  const { addParts } = useWorkOrdersService();

  const form = useForm({
    initialValues: {
      parts: formList([
        { partNumber: "", partName: "", quantity: 1, unitPrice: 0.0 },
      ]),
    },

    validate: {
      parts: {
        unitPrice: (value) =>
          value > 0.0 ? null : "Unit price must be greater than 0.0",
      },
    },
  });

  const fields = form.values.parts.map((item: any, i: number) => (
    <Group key={i} sx={{ alignItems: "flex-start" }}>
      <Box
        sx={{
          alignSelf: "flex-end",
          width: 28,
          height: 36,
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
      <TextInput
        required
        label="Part Number"
        placeholder="Part Number"
        {...form.getListInputProps("parts", i, "partNumber")}
      />
      <TextInput
        required
        label="Part Name"
        placeholder="Part Name"
        {...form.getListInputProps("parts", i, "partName")}
      />

      <NumberInput
        label="Quantity"
        required
        min={1}
        step={1}
        {...form.getListInputProps("parts", i, "quantity")}
        sx={{ width: 120 }}
      />
      <NumberInput
        required
        hideControls
        placeholder="Unit Price"
        label="Unit Price"
        precision={2}
        {...form.getListInputProps("parts", i, "unitPrice")}
        icon={<Text color="dimmed">Birr</Text>}
      />
      <InputWrapper label=" " sx={{ alignSelf: "center" }}>
        <ActionIcon
          sx={{ visibility: i === 0 ? "hidden" : "visible" }}
          color="red"
          variant="transparent"
          onClick={() => form.removeListItem("parts", i)}
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
      setAddingParts(true);
      await addParts(workOrder.id, values);
      showNotification({
        title: "Spare Parts Registered",
        message: `Spare Parts registered successfully`,
        icon: <Check size={18} />,
      });
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setAddingParts(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
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
        </Group>
        {fields}
        <Group>
          <Tooltip label="Add a row" withArrow mt={15}>
            <ActionIcon
              color="blue"
              variant="transparent"
              onClick={() =>
                form.addListItem("parts", {
                  partNumber: "",
                  partName: "",
                  quantity: 1,
                  unitPrice: 0.0,
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
          <Button type="submit" loading={addingParts}>
            {form.values.parts.length > 1
              ? "Register Spare Parts"
              : "Register Spare Part"}
          </Button>
          <Box sx={{ width: 28 }}></Box>
        </Group>
      </form>
    </Box>
  );
}

export default AddSpareParts;
