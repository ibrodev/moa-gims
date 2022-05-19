import { Loader } from "@mantine/core";
import { Center } from "@mantine/core";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  MultiSelect,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { formList, useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useEffect, useMemo, useState } from "react";
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
import { any, z } from "zod";
import useDepartmentsService from "../../../hooks/services/useDepartmentsService";
import useDriversService from "../../../hooks/services/useDriversService";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";
import useUsersService from "../../../hooks/services/useUsersService";
import useVehiclesService from "../../../hooks/services/useVehiclesService";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";
import useAuth from "../../../hooks/useAuth";

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

function CreateWorkOrder({ setNewWorkOrder }: any) {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState<any>({});
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const workTypes = [
    { value: "Mechanical", label: "Mechanical" },
    { value: "Electrical", label: "Electrical" },
    { value: "Body", label: "Body" },
  ];

  const { auth } = useAuth();

  const { getAll: getAllServiceRequests } = useServiceRequestsService();
  const { getAll: getAllEmployees } = useEmployeesService();

  const { create } = useWorkOrdersService();

  const fetchServiceRequests = async () => {
    try {
      const response = await getAllServiceRequests();
      const serviceRequests = response?.filter(
        (serviceRequest: any) =>
          serviceRequest.inspectorId === auth.user.employeeId &&
          serviceRequest.status === "accepted" &&
          serviceRequest.Faults.some((fault: any) => !fault.workOrderId)
      );
      setServiceRequests(serviceRequests);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchLoading(false);
    }
  };

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

  const handleServiceRequestSelect = (serviceRequestId: any) => {
    form.setFieldValue("serviceRequestId", serviceRequestId);
    setSelectedServiceRequest(
      serviceRequests.filter(
        (serviceRequest: any) =>
          serviceRequest.id === parseInt(serviceRequestId)
      )[0]
    );
  };

  const serviceRequestFaults = useMemo(
    () =>
      selectedServiceRequest?.Faults
        ? selectedServiceRequest.Faults?.filter(
            (fault: any) => fault.workOrderId === null
          ).map((fault: any) => ({
            value: `${fault.id}`,
            label: `${fault.description}`,
          }))
        : [],
    [selectedServiceRequest]
  );

  const serviceRequestIdSelectData = useMemo(
    () =>
      serviceRequests.map((serviceRequest: any) => ({
        value: `${serviceRequest.id}`,
        label: `${serviceRequest.id}`,
      })),
    [serviceRequests]
  );

  const form = useForm({
    // schema: zodResolver(schema),
    initialValues: {
      serviceRequestId: "",
      expertId: "",
      workType: "",
      faults: [],
    },
  });

  useEffect(() => {
    fetchServiceRequests();
    fetchExperts();
  }, []);

  const handleOnSubmit = async (values: any) => {
    try {
      setLoading(true);
      const id = await create(values);
      showNotification({
        title: "Work Order created",
        message: `Work Order with id ${id} created`,
        icon: <Check size={18} />,
      });
      setNewWorkOrder(id);
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

  if (fetchLoading)
    return (
      <Box
        sx={{
          height: "calc(100vh - 100px) !important",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Loader variant="oval" />
        <Text mt={5} color="dimmed">
          Loading form...
        </Text>
      </Box>
    );

  return (
    <Box>
      {serviceRequests.length > 0 ? (
        <form onSubmit={form.onSubmit(handleOnSubmit)}>
          <Select
            required
            label="Service Request"
            name="serviceRequestId"
            placeholder="Service Request"
            itemComponent={SelectItem}
            size="md"
            searchable
            data={serviceRequestIdSelectData}
            value={form.values.serviceRequestId}
            onChange={(e: any) => handleServiceRequestSelect(e)}
            error={form.errors.serviceRequestId}
          />

          <Select
            required
            label="Expert"
            name="expertId"
            placeholder="Select Expert"
            itemComponent={SelectItem}
            size="md"
            searchable
            data={experts}
            {...form.getInputProps("expertId")}
          />
          <Select
            required
            label="Work Type"
            name="workType"
            placeholder="Select Work Type"
            size="md"
            searchable
            data={workTypes}
            {...form.getInputProps("workType")}
          />

          <MultiSelect
            required
            label="Faults"
            name="faults"
            placeholder="Select Faults"
            size="md"
            searchable
            data={serviceRequestFaults}
            disabled={!selectedServiceRequest?.id}
            {...form.getInputProps("faults")}
          />

          <Button size="md" mt={20} type="submit" loading={loading}>
            Create Work Order
          </Button>
        </form>
      ) : (
        <Box
          sx={{
            height: "calc(100vh - 100px) !important",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Text>No Service Request found to create a Work Order</Text>
        </Box>
      )}
    </Box>
  );
}

export default CreateWorkOrder;
