import { Box, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, User } from "tabler-icons-react";
import { z } from "zod";
import useDepartmentsService from "../../../hooks/services/useDepartmentsService";

function CreateDepartment({ setNewDepartment }: any) {
  const [loading, setLoading] = useState(false);

  const { create } = useDepartmentsService();

  // const schema = z.object({
  //   name: z
  //     .string()
  //     .min(4, { message: "Username must be at least 4 characters long" })
  //     .max(20, { message: "Username must be 20 or less characters long" }),
  // });

  const form = useForm({
    // schema: zodResolver(schema),
    initialValues: {
      name: "",
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await create(values);
      showNotification({
        title: "Department created",
        message: `Department with id ${id} created successfully`,
        icon: <Check size={18} />,
      });
      setNewDepartment(id);
      form.reset();
    } catch (errors: any) {
      interface errorInterface {
        [key: string]: string;
      }

      let error: errorInterface = {};
      errors?.forEach((errorItem: any) => {
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
          Create Department
        </Button>
      </form>
    </Box>
  );
}

export default CreateDepartment;
