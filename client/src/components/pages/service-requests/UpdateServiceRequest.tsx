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

function UpdateServiceRequest({
  setNewServiceRequest,
  data,
  setActionDrawer,
}: any) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAll: getAllVehicles } = useVehiclesService();
  const { getAll: getAllDrivers } = useDriversService();
  const { getAll: getAllDepartments } = useDepartmentsService();

  const { update } = useServiceRequestsService();

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
      vehicleId: `${data.vehicleId}`,
      driverId: `${data.driverId}`,
      departmentId: `${data.departmentId}`,
    },
  });

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchDepartments();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await update(data.id, values);

      showNotification({
        title: "Service Request updated",
        message: `Service Request with id ${id} updated successfully`,
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
        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Service Request
        </Button>
      </form>
    </Box>
  );
}

export default UpdateServiceRequest;
