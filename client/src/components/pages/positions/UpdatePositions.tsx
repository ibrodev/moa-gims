import { Box, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, User } from "tabler-icons-react";
import { z } from "zod";
import usePositionsService from "../../../hooks/services/usePositionsService";

function UpdatePosition({ setNewPosition, data, setActionDrawer }: any) {
  const [loading, setLoading] = useState(false);

  const { update } = usePositionsService();

  const schema = z.object({
    name: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" })
      .max(20, { message: "Username must be 20 or less characters long" }),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: data.Name,
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await update(data.id, values);

      showNotification({
        title: "Position updated",
        message: `Position with id ${id} updated successfully`,
        icon: <Check size={18} />,
      });
      setNewPosition(id);
      setActionDrawer((prev: any) => ({ ...prev, opened: false }));
    } catch (errors: any) {
      interface errorInterface {
        [key: string]: string;
      }

      let error: errorInterface = {};
      errors?.forEach((errorItem: any) => {
        if (errorItem.name) return (error.name = errorItem.name);
        error[errorItem.path] = errorItem.message;
      });

      form.setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleOnSubmit)}>
        <TextInput
          required
          label="Position Name"
          name="name"
          placeholder="Position Name"
          {...form.getInputProps("name")}
          icon={<User size={20} />}
          size="md"
        />

        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Position
        </Button>
      </form>
    </Box>
  );
}

export default UpdatePosition;
