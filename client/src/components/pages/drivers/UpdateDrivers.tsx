import { Box, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check } from "tabler-icons-react";
import { z } from "zod";
import useDriversService from "../../../hooks/services/useDriversService";

function UpdateDriver({ setNewDriver, data, setActionDrawer }: any) {
  const [loading, setLoading] = useState(false);

  const { update } = useDriversService();

  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    licenseNo: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      firstName: data["First Name"],
      lastName: data["Last Name"],
      licenseNo: data["License No"],
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await update(data.id, values);

      showNotification({
        title: "Driver updated",
        message: `Driver with id ${id} updated successfully`,
        icon: <Check size={18} />,
      });
      setNewDriver(id);
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
          label="First Name"
          name="firstName"
          placeholder="Driver First Name"
          {...form.getInputProps("firstName")}
          size="md"
        />
        <TextInput
          required
          label="Last Name"
          name="lastName"
          placeholder="Driver Last Name"
          {...form.getInputProps("lastName")}
          size="md"
        />
        <TextInput
          required
          label="License No"
          name="licenseNo"
          placeholder="Driver Driving License No"
          {...form.getInputProps("licenseNo")}
          size="md"
        />

        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Driver
        </Button>
      </form>
    </Box>
  );
}

export default UpdateDriver;
