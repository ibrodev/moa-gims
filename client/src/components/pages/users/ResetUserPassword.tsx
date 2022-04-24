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

function ResetUserPassword({ setNewUser, data }: any) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useUsersService();

  const schema = z.object({
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters long" }),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      password: "",
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await resetPassword(data.id, values);
      showNotification({
        title: "User password reset",
        message: `User password reset successfully`,
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
          label="Username"
          // name="username"
          placeholder="Username"
          value={data.Username}
          icon={<User size={20} />}
          size="md"
          disabled
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
        <Button size="md" mt={20} type="submit" loading={loading}>
          Reset Password
        </Button>
      </form>
    </Box>
  );
}

export default ResetUserPassword;
