import {
  Box,
  Button,
  Group,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Id, Key, User, UserCircle } from "tabler-icons-react";
import { z } from "zod";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import usePositionsService from "../../../hooks/services/usePositionsService";
import useUsersService from "../../../hooks/services/useUsersService";

interface PositionInterface {
  id: number;
  name: string;
}

function CreateEmployee({ setNewEmployee }: any) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { create } = useEmployeesService();
  const { getAll } = usePositionsService();

  const fetchPositions = async () => {
    try {
      const response = await getAll();
      const positions = response?.map((position: PositionInterface) => ({
        value: position.id,
        label: position.name,
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

    positionId: z.number(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      firstName: "",
      lastName: "",
      positionId: "",
    },
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await create(values);
      showNotification({
        title: "Employee created",
        message: `Employee with id ${id} created successfully`,
        icon: <Check size={18} />,
      });
      setNewEmployee(id);
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
          Create Employee
        </Button>
      </form>
    </Box>
  );
}

export default CreateEmployee;
