import { Checkbox } from "@mantine/core";
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
import { useNavigate } from "react-router-dom";
import {
  BuildingFactory,
  Check,
  Id,
  Key,
  Square0,
  User,
  UserCircle,
} from "tabler-icons-react";
import { z } from "zod";
import useVehiclesService from "../../../hooks/services/useVehiclesService";

function CreateVehicle({ setNewVehicle }: any) {
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<any>([]);

  const { create, getTypes } = useVehiclesService();

  const schema = z.object({
    plateNo: z.string(),
    manufacturer: z.string(),
    model: z.string(),
    engineNo: z.string().optional(),
    engineType: z.string().optional(),
    chassisNo: z.string().optional(),
    vehicleTypeId: z.string(),
    project: z.boolean(),
  });

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      plateNo: "",
      manufacturer: "",
      model: "",
      engineNo: "",
      engineCapacity: null,
      engineType: "",
      chassisNo: "",
      vehicleTypeId: "",
      project: false,
    },
  });

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await create(values);
      showNotification({
        title: "Vehicle created",
        message: `Vehicle with id ${id} created`,
        icon: <Check size={18} />,
      });
      setNewVehicle(id);
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

  const fetchVehicleTypes = async () => {
    const result = await getTypes();
    const types = result.map((type: any) => ({
      label: `${type.name}`,
      value: `${type.id}`,
    }));
    setVehicleTypes(types);
  };

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleOnSubmit)}>
        <Group sx={{ alignItems: "end" }}>
          <TextInput
            required
            label="Plate No"
            name="plateNo"
            placeholder="Plate No"
            description="PN format: 4-digits of plate no-ET, e.g. 4-32132-ET"
            {...form.getInputProps("plateNo")}
            size="md"
          />
          <Checkbox
            mt="md"
            label="Project Owned"
            {...form.getInputProps("project", { type: "checkbox" })}
            mb={1}
          />
        </Group>
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
        <Select
          required
          label="Vehicle Type"
          data={vehicleTypes}
          placeholder="Select Vehicle Type"
          nothingFound="Nothing found"
          value={form.values.vehicleTypeId}
          onChange={(value: any) => form.setFieldValue("vehicleTypeId", value)}
          searchable
          creatable
          getCreateLabel={(query) => `+ Create "${query}"`}
          onCreate={(query) =>
            setVehicleTypes((current: any) => {
              const newType = { label: query, value: query };
              return [...current, newType];
            })
          }
        />
        <TextInput
          label="Engine No"
          name="engineNo"
          placeholder="Engine No"
          {...form.getInputProps("engineNo")}
          size="md"
        />
        <NumberInput
          label="Engine Capacity (CC)"
          hideControls
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
          Create Vehicle
        </Button>
      </form>
    </Box>
  );
}

export default CreateVehicle;
