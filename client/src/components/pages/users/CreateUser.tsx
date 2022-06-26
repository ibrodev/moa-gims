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
import useUsersService from "../../../hooks/services/useUsersService";

interface EmployeeInterface {
  id: number;
  firstName: string;
  lastName: string;
  Position: { name: string };
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  position: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, position, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {position}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function CreateUser({ setNewUser }: any) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "recorder", label: "Recorder" },
    { value: "team-leader", label: "Team Leader" },
    { value: "inspector", label: "Inspector" },
  ];

  const { getAll } = useEmployeesService();
  const { create } = useUsersService();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await getAll();
      const employees = response?.map((employee: EmployeeInterface) => ({
        value: `${employee.id}`,
        label: `${employee.firstName} ${employee.lastName}`,
        position: employee.Position.name,
      }));
      setEmployees(employees);
    } catch (error) {
      console.log(error);
    }
  };

  const schema = z.object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" })
      .max(20, { message: "Username must be 20 or less characters long" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" }),
    role: z
      .string()
      .refine((value) => roles.some((role) => role.value === value), {
        message:
          "Role must be one of the following: admin, recorder, team-leader, inspector",
      }),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      username: "",
      password: "",
      role: "",
      employeeId: "",
    },
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await create(values);
      showNotification({
        title: "User created",
        message: `User with id ${id} created`,
        icon: <Check size={18} />,
      });
      setNewUser(id);
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
          label="Username"
          name="username"
          placeholder="Username"
          {...form.getInputProps("username")}
          icon={<User size={20} />}
          size="md"
        />
        <PasswordInput
          required
          label="Password"
          name="password"
          placeholder="Password"
          {...form.getInputProps("password")}
          icon={<Key size={20} />}
          size="md"
        />
        <Select
          required
          label="Role"
          name="role"
          placeholder="Select Role"
          {...form.getInputProps("role")}
          icon={<UserCircle size={20} />}
          size="md"
          data={roles}
        />
        <Select
          label="Employee"
          name="employeeId"
          placeholder="Select Employee"
          itemComponent={SelectItem}
          {...form.getInputProps("employeeId")}
          icon={<Id size={20} />}
          size="md"
          data={employees}
        />
        <Button size="md" mt={20} type="submit" loading={loading}>
          Create User
        </Button>
      </form>
    </Box>
  );
}

export default CreateUser;
