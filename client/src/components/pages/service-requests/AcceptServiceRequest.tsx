import { TextInput } from "@mantine/core";
import { Box, Button, NumberInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check } from "tabler-icons-react";
import { z } from "zod";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";

function AcceptServiceRequest({ setNewServiceRequest, data, closeModal }: any) {
  const [loading, setLoading] = useState(false);

  const { accept } = useServiceRequestsService();

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
      odometerReading: "",
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      await accept(data.id, values);

      showNotification({
        title: "Service Request Accepted",
        message: `Service Request accepted successfully`,
        icon: <Check size={18} />,
      });
      setNewServiceRequest(randomId());
      closeModal();
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
          required
          label="Odometer Reading"
          name="odometerReading"
          placeholder="Enter Odometer Reading"
          {...form.getInputProps("odometerReading")}
          size="md"
          hideControls
        />
        <Button size="md" mt={20} type="submit" loading={loading}>
          Accept Service Request
        </Button>
      </form>
    </Box>
  );
}

export default AcceptServiceRequest;
