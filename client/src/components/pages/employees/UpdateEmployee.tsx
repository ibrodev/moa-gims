import { Box, Button, Select, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Check, Id, User } from "tabler-icons-react";
import { z } from "zod";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import usePositionsService from "../../../hooks/services/usePositionsService";

interface PositionInterface {
  id: number;
  name: string;
}

function UpdateEmployee({ setNewEmployee, data, setActionDrawer }: any) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { update } = useEmployeesService();
  const { getAll } = usePositionsService();

  const fetchPositions = async () => {
    try {
      const response = await getAll();
      const positions = response?.map((position: PositionInterface) => ({
        value: `${position.id}`,
        label: `${position.name}`,
      }));
      setPositions(positions);
    } catch (error) {
      console.log(error);
    }
  };

  const schema = z.object({
    firstName: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" })
      .max(20, { message: "Username must be 20 or less characters long" }),
    lastName: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" })
      .max(20, { message: "Username must be 20 or less characters long" }),

    positionId: z.string(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      firstName: data["First Name"],
      lastName: data["Last Name"],
      positionId: data.positionId,
    },
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await update(data.id, values);

      showNotification({
        title: "Employee updated",
        message: `Employee with id ${id} updated successfully`,
        icon: <Check size={18} />,
      });
      setNewEmployee(id);
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
          placeholder="First Name"
          {...form.getInputProps("firstName")}
          icon={<User size={20} />}
          size="md"
        />
        <TextInput
          required
          label="Last Name"
          name="lastName"
          placeholder="Last Name"
          {...form.getInputProps("lastName")}
          icon={<User size={20} />}
          size="md"
        />
        <Select
          label="Position"
          name="positionId"
          {...form.getInputProps("positionId")}
          placeholder="Select Position"
          data={positions}
          icon={<Id size={20} />}
          size="md"
          clearable
        />
        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Employee
        </Button>
      </form>
    </Box>
  );
}

export default UpdateEmployee;
