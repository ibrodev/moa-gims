import { Box, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, User } from "tabler-icons-react";
import { z } from "zod";
import useDepartmentsService from "../../../hooks/services/useDepartmentsService";

function UpdateDepartment({ setNewDepartment, data, setActionDrawer }: any) {
  const [loading, setLoading] = useState(false);

  const { update } = useDepartmentsService();

  const schema = z.object({
    name: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" }),
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
        title: "Department updated",
        message: `Department with id ${id} updated successfully`,
        icon: <Check size={18} />,
      });
      setNewDepartment(id);
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
          label="Department Name"
          name="name"
          placeholder="Department Name"
          {...form.getInputProps("name")}
          icon={<User size={20} />}
          size="md"
        />

        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Department
        </Button>
      </form>
    </Box>
  );
}

export default UpdateDepartment;
