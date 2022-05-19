import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { formList, useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Id,
  Key,
  Plus,
  Trash,
  User,
  UserCircle,
  X,
} from "tabler-icons-react";
import { z } from "zod";
import useDepartmentsService from "../../../hooks/services/useDepartmentsService";
import useDriversService from "../../../hooks/services/useDriversService";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";
import useUsersService from "../../../hooks/services/useUsersService";
import useVehiclesService from "../../../hooks/services/useVehiclesService";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  licenseNo: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, licenseNo, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {licenseNo}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function CreateServiceRequest({ setNewServiceRequest }: any) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAll: getAllVehicles } = useVehiclesService();
  const { getAll: getAllDrivers } = useDriversService();
  const { getAll: getAllDepartments } = useDepartmentsService();

  const { create } = useServiceRequestsService();

  const fetchVehicles = async () => {
    try {
      const response = await getAllVehicles();
      const vehicles = response?.map((vehicle: any) => ({
        value: `${vehicle.id}`,
        label: `${vehicle.plateNo}`,
      }));
      setVehicles(vehicles);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await getAllDrivers();
      const drivers = response?.map((driver: any) => ({
        value: `${driver.id}`,
        label: `${driver.firstName} ${driver.lastName}`,
        licenseNo: driver.licenseNo,
      }));
      setDrivers(drivers);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      const departments = response?.map((department: any) => ({
        value: `${department.id}`,
        label: `${department.name}`,
      }));
      setDepartments(departments);
    } catch (error) {
      console.log(error);
    }
  };

  // const schema = z.object({
  //   username: z
  //     .string()
  //     .min(4, { message: "Username must be at least 4 characters long" })
  //     .max(20, { message: "Username must be 20 or less characters long" }),
  //   password: z
  //     .string()
  //     .min(5, { message: "Password must be at least 5 characters long" }),
  //   role: z
  //     .string()
  //     .refine((value) => roles.some((role) => role.value === value), {
  //       message:
  //         "Role must be one of the following: admin, recorder, team-leader, inspector",
  //     }),
  //   employeeId: z.number().optional(),
  // });

  const form = useForm({
    // schema: zodResolver(schema),
    initialValues: {
      vehicleId: "",
      driverId: "",
      departmentId: "",
      faults: formList([{ description: "" }]),
    },
  });

  const fields = form.values.faults.map((_, index) => (
    <Group
      key={index}
      spacing="xs"
      position="apart"
      styles={{
        root: {
          alignItems: "end",
        },
        child: { "&:first-child": { flexGrow: "1 !important" } },
      }}
    >
      <TextInput
        required
        label="Description"
        placeholder="description"
        {...form.getListInputProps("faults", index, "description")}
        size="md"
        styles={{}}
      />
      <Button
        color="red"
        size="md"
        style={{ padding: "0 .8rem" }}
        disabled={index === 0}
        onClick={() => form.removeListItem("faults", index)}
      >
        <Trash size={16} />
      </Button>
    </Group>
  ));

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchDepartments();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await create(values);
      showNotification({
        title: "Service Request created",
        message: `Service Request with id ${id} created`,
        icon: <Check size={18} />,
      });
      setNewServiceRequest(id);
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
        <Select
          required
          label="Vehicle"
          name="vehicleId"
          placeholder="Select Vehicle"
          itemComponent={SelectItem}
          {...form.getInputProps("vehicleId")}
          size="md"
          searchable
          data={vehicles}
        />

        <Select
          required
          label="Driver"
          name="driverId"
          placeholder="Select Driver"
          itemComponent={SelectItem}
          {...form.getInputProps("driverId")}
          size="md"
          searchable
          data={drivers}
        />
        <Select
          required
          label="Department"
          name="departmentId"
          placeholder="Select Department"
          {...form.getInputProps("departmentId")}
          size="md"
          searchable
          data={departments}
        />

        <Divider
          my="sm"
          label="Faults"
          labelPosition="center"
          styles={{
            label: { color: "black", fontSize: "1rem" },
          }}
        />

        {/* {fields.length > 0 ? <Text>Faults</Text> : <Text>No one here...</Text>} */}
        {fields}
        <ActionIcon
          variant="filled"
          color="green"
          mt="xs"
          onClick={() => form.addListItem("faults", { description: "" })}
        >
          <Plus size={16} />
        </ActionIcon>

        <Button size="md" mt={20} type="submit" loading={loading}>
          Create Service Request
        </Button>
      </form>
    </Box>
  );
}

export default CreateServiceRequest;
