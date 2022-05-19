import { Box, Button, Group, Select, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { z } from "zod";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";

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

function UpdateWorkOrder({ setNewWorkOrder, data, setActionDrawer }: any) {
  const [experts, setExperts] = useState([]);
  const workTypes = [
    { value: "Mechanical", label: "Mechanical" },
    { value: "Electrical", label: "Electrical" },
    { value: "Body", label: "Body" },
  ];
  const [loading, setLoading] = useState(false);

  const { getAll: getAllEmployees } = useEmployeesService();

  const { update } = useWorkOrdersService();

  const fetchExperts = async () => {
    try {
      const response = await getAllEmployees();
      const employees = response?.map((employee: any) => ({
        value: `${employee.id}`,
        label: `${employee.firstName} ${employee.lastName}`,
        position: `${employee.Position?.name}`,
      }));
      setExperts(employees);
    } catch (error) {
      console.log(error);
    }
  };

  const form = useForm({
    initialValues: {
      expertId: `${data.expertId}`,
      workType: `${data["Work Type"]}`,
    },
  });

  useEffect(() => {
    console.log(data);

    fetchExperts();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await update(data.id, values);

      showNotification({
        title: "Work Order updated",
        message: `Work Order with id ${id} updated successfully`,
        icon: <Check size={18} />,
      });
      setNewWorkOrder(id);
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
          label="Expert"
          name="expertId"
          placeholder="Select Expert"
          itemComponent={SelectItem}
          {...form.getInputProps("expertId")}
          size="md"
          searchable
          data={experts}
        />

        <Select
          required
          label="Work Type"
          name="workType"
          placeholder="Select Work Type"
          itemComponent={SelectItem}
          {...form.getInputProps("workType")}
          size="md"
          searchable
          data={workTypes}
        />

        <Button size="md" mt={20} type="submit" loading={loading}>
          Update Work Order
        </Button>
      </form>
    </Box>
  );
}

export default UpdateWorkOrder;
