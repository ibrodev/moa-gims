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
import { Check, Id, Key, User, UserCircle } from "tabler-icons-react";
import { z } from "zod";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import useUsersService from "../../../hooks/services/useUsersService";
import useVehiclesService from "../../../hooks/services/useVehiclesService";

function UpdateVehicle({ setNewVehicle, data, setActionDrawer }: any) {
  const [loading, setLoading] = useState(false);

  const { update } = useVehiclesService();

  const schema = z.object({
    plateNo: z.string(),
    manufacturer: z.string(),
    model: z.string(),
    engineNo: z.string().optional(),
    engineCapacity: z.number().optional(),
    engineType: z.string().optional(),
    chassisNo: z.string().optional(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      plateNo: data["Plate No"],
      manufacturer: data["Manufacturer"],
      model: data["Model"],
      engineNo: data["Engine No"] || undefined,
      engineCapacity: data["Engine Capacity"] || undefined,
      engineType: data["Engine Type"] || undefined,
      chassisNo: data["Chassis No"] || undefined,
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await update(data.id, values);

      showNotification({
        title: "Vehicle updated",
        message: `Vehicle with id ${id} updated successfully`,
        icon: <Check size={18} />,
      });
      setNewVehicle(id);
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
        <TextInput
          required
          label="Plate No"
          name="plateNo"
          placeholder="Plate No"
          {...form.getInputProps("plateNo")}
          size="md"
        />
        <TextInput
          required
          label="Manufacturer"
          name="manufacturer"
          placeholder="Manufacturer"
          {...form.getInputProps("manufacturer")}
          size="md"
        />
        <TextInput
          required
          label="Model"
          name="model"
          placeholder="Model"
          {...form.getInputProps("model")}
          size="md"
        />
        <TextInput
          label="Engine No"
          name="engineNo"
          placeholder="Engine No"
          {...form.getInputProps("engineNo")}
          size="md"
        />
        <TextInput
          label="Engine Capacity (CC)"
          name="engineCapacity"
          placeholder="Engine Capacity (CC)"
          {...form.getInputProps("engineCapacity")}
          size="md"
        />
        <TextInput
          label="Engine Type"
          name="engineType"
          placeholder="Engine Type"
          {...form.getInputProps("engineType")}
          size="md"
        />
        <TextInput
          label="Chassis No"
          name="chassisNo"
          placeholder="Chassis No"
          {...form.getInputProps("chassisNo")}
          size="md"
        />
        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Vehicle
        </Button>
      </form>
    </Box>
  );
}

export default UpdateVehicle;
