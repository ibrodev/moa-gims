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

function AssignInspector({ setNewServiceRequest, data, setActionDrawer }: any) {
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getAll } = useEmployeesService();

  const { assignInspector } = useServiceRequestsService();

  const fetchInspectors = async () => {
    try {
      const response = await getAll();
      const inspectors = response
        ?.filter((inspector: any) => inspector.Position?.name === "Inspector")
        .map((inspector: any) => ({
          value: `${inspector.id}`,
          label: `${inspector.firstName} ${inspector.lastName}`,
          position: inspector.Position?.name,
        }));
      setInspectors(inspectors);
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
      inspectorId: "",
    },
  });

  useEffect(() => {
    fetchInspectors();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await assignInspector(data.id, values);

      showNotification({
        title: "Inspector Assigned",
        message: `Inspector assigned successfully`,
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
          label="Inspector"
          name="inspectorId"
          placeholder="Select Inspector"
          itemComponent={SelectItem}
          {...form.getInputProps("inspectorId")}
          size="md"
          searchable
          data={inspectors}
        />

        <Button size="md" mt={20} type="submit" loading={loading}>
          Assign Inspector
        </Button>
      </form>
    </Box>
  );
}

export default AssignInspector;
