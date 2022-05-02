import {
  Alert,
  Box,
  Button,
  Image,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import MoALogo from "../../../images/moa-logo.png";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Key, User, Logout, AlertCircle } from "tabler-icons-react";
import AuthService from "../../../hooks/services/AuthService";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function Login() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value === ""
          ? "Username is required"
          : value.length > 20 || value.length < 4
          ? "Username must be between 4 and 20 characters"
          : null,
      password: (value) => (value === "" ? "Password is required" : null),
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await AuthService.create(values);
      setAuth({
        token: response.token,
        userRole: response.userRole,
        username: response.username,
        user: response.user,
      });

      return navigate("/");
    } catch (error: any) {
      form.setErrors({ error: error.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        mx="auto"
      >
        <Image
          src={MoALogo}
          alt="The Ministry of Agriculture Logo"
          style={{ width: "100px", aspectRatio: "square", marginTop: "5rem" }}
        />
        <Title
          style={{
            textAlign: "center",
            marginTop: "32px",
            marginBottom: "32px",
          }}
          order={4}
        >
          MoA - Garage Information Management System
        </Title>

        {form.errors.error && (
          <Alert
            icon={<AlertCircle size={24} />}
            title="Opssss...!"
            color="red"
            variant="filled"
            style={{ marginBottom: "1rem", width: "100%" }}
          >
            {form.errors.error}
          </Alert>
        )}

        <form
          onSubmit={form.onSubmit(handleOnSubmit)}
          style={{ width: "100%" }}
        >
          <TextInput
            required
            label="Username"
            name="username"
            placeholder="your username here"
            {...form.getInputProps("username")}
            icon={<User size={20} />}
            size="md"
          />
          <PasswordInput
            required
            label="Password"
            name="password"
            placeholder="your password here"
            {...form.getInputProps("password")}
            icon={<Key size={20} />}
            size="md"
          />
          <Button
            type="submit"
            rightIcon={<Logout size={20} />}
            sx={{ marginTop: 20 }}
            loading={loading}
            size="md"
            fullWidth
          >
            Login
          </Button>
        </form>
        <Box sx={{ marginTop: 100, textAlign: "center" }}>
          <Text size="xs" color="gray">
            Developed and Designed by
          </Text>
          <Text size="xs" weight={600} color="gray">
            MoA, ICT Directorate
          </Text>
        </Box>
      </Box>
    </>
  );
}

export default Login;
