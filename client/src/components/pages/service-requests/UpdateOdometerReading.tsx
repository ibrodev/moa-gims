import {
  Box,
  Button,
  Group,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useEffect, useState } from "react";
import { Check, Id, Key, User, UserCircle } from "tabler-icons-react";
import { z } from "zod";
import useDepartmentsService from "../../../hooks/services/useDepartmentsService";
import useDriversService from "../../../hooks/services/useDriversService";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";
import useUsersService from "../../../hooks/services/useUsersService";
import useVehiclesService from "../../../hooks/services/useVehiclesService";

function UpdateOdometerReading({
  setNewServiceRequest,
  data,
  setActionDrawer,
}: any) {
  const [loading, setLoading] = useState(false);

  const { updateOdometerReading } = useServiceRequestsService();

  // const schema = z.object({
  //   username: z
  //     .string()
  //     .min(4, { message: "Username must be at least 4 characters long" })
  //     .max(20, { message: "Username must be 20 or less characters long" }),
  //   role: z
  //     .string()
  //     .refine((value) => roles.some((role) => role.value === value), {
  //       message:
  //         "Role must be one of the following: admin, recorder, team-leader, inspector",
  //     }),
  //   employeeId: z.string().optional().nullable(),
  // });

  const form = useForm({
    // schema: zodResolver(schema),
    initialValues: {
      odometerReading: data["Odometer Reading"],
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await updateOdometerReading(data.id, values);

      showNotification({
        title: "Odometer Reading updated",
        message: `Odometer Reading updated successfully`,
        icon: <Check size={18} />,
      });
      setNewServiceRequest(id);
      setActionDrawer((prev: any) => ({ ...prev, opened: false }));
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
        <NumberInput
          label="Odometer Reading"
          name="odometerReading"
          placeholder="Enter Odometer Reading Number"
          {...form.getInputProps("odometerReading")}
          size="md"
          hideControls
        />
        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Odometer Reading
        </Button>
      </form>
    </Box>
  );
}

export default UpdateOdometerReading;
