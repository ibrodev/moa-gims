import { Stack } from "@mantine/core";
import { Title } from "@mantine/core";
import { Loader } from "@mantine/core";
import { Text } from "@mantine/core";
import { Container } from "@mantine/core";
import { Group } from "@mantine/core";
import { Grid } from "@mantine/core";
import { InputWrapper } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { List } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Center } from "@mantine/core";
import { MultiSelect } from "@mantine/core";
import { Select } from "@mantine/core";
import { Button } from "@mantine/core";
import { Stepper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Check, X } from "tabler-icons-react";
import useEmployeesService from "../../../hooks/services/useEmployeesService";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";
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

function CreateWorkOrder({ setNewWorkOrder, closeModal }: any) {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [workExperts, setWorkExperts] = useState([]);
  const [loadingServiceRequests, setLoadingServiceRequests] = useState(true);
  const [selectedServiceRequestFaults, setSelectedServiceRequestFaults] =
    useState<any>([]);
  const [loadingWorkExperts, setLoadingWorkExperts] = useState(false);
  const [activeStepper, setActiveStepper] = useState(0);
  const [creatingWorkOrder, setCreatingWorkOrder] = useState(false);
  const [workOrderCreated, setWorkOrderCreated] = useState<any>(null);

  const { create } = useWorkOrdersService();
  const { getAll } = useServiceRequestsService();
  const { getAll: getAllEmployees } = useEmployeesService();
  const { auth } = useAuth();
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      serviceRequestId: "",
      type: "",
      serviceType: "",
      workDepartment: "",
      expertId: "",
      maintenanceType: "",
      maintenanceLocation: "",
      crashAccident: false,
      insurance: false,
      faults: [],
    },

    validate: {
      serviceRequestId: (value) =>
        value === "" ? "Service Request Number is Required" : null,
      type: (value) => (value === "" ? "Work Order Type is Required" : null),
      serviceType: (value) =>
        value === "" ? "Service Type is Required" : null,
      faults: (value) =>
        value.length === 0
          ? "You must select atleast one fault from the list"
          : null,
      workDepartment: (value) =>
        value.length === 0 ? "Work Department is Required" : null,
      expertId: (value) =>
        value.length === 0 ? "Work Expert is Required" : null,
      maintenanceType: (value) =>
        value.length === 0 ? "Maintenance Type is Required" : null,
      maintenanceLocation: (value) =>
        value.length === 0 ? "Maintenance Location is Required" : null,
    },
  });

  const navigateStepper = (direction: string) => {
    if (
      activeStepper === 0 &&
      direction === "next" &&
      (form.validateField("serviceRequestId").hasError ||
        form.validateField("faults").hasError)
    )
      return;

    if (
      activeStepper === 1 &&
      direction === "next" &&
      (form.validateField("type").hasError ||
        form.validateField("serviceType").hasError)
    )
      return;

    if (
      activeStepper === 2 &&
      direction === "next" &&
      form.values.serviceType === "in-house" &&
      (form.validateField("workDepartment").hasError ||
        form.validateField("expertId").hasError ||
        form.validateField("maintenanceType").hasError ||
        form.validateField("maintenanceLocation").hasError)
    )
      return;
    if (
      activeStepper === 2 &&
      direction === "next" &&
      form.values.serviceType === "out-source" &&
      form.validateField("maintenanceType").hasError
    )
      return;

    if (direction === "next") return nextStep();

    if (direction === "prev") return prevStep();
  };

  const nextStep = () =>
    setActiveStepper((current: number) =>
      current < 3 ? current + 1 : current
    );

  const prevStep = () =>
    setActiveStepper((current: number) =>
      current > 0 ? current - 1 : current
    );

  const fetchServiceRequests = async () => {
    try {
      let serviceRequests = await getAll();
      serviceRequests = serviceRequests.filter(
        (serviceRequest: any) =>
          serviceRequest.status === "accepted" &&
          auth.userRole === "inspector" &&
          serviceRequest.inspectorId === auth.user.employeeId
      );
      setServiceRequests(serviceRequests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingServiceRequests(false);
    }
  };

  const createWorkOrder = async () => {
    try {
      setCreatingWorkOrder(true);
      const workOrderId = await create(form.values);
      setWorkOrderCreated(workOrderId);
      closeModal();
      showNotification({
        title: "Work Order Created",
        message: `Work Order with id ${workOrderId} created successfully`,
        icon: <Check size={18} />,
      });
      setNewWorkOrder(workOrderId);
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingWorkOrder(false);
    }
  };

  const fetchWorkExperts = async () => {
    try {
      setLoadingWorkExperts(true);

      const employees = await getAllEmployees();
      const workExperts = employees
        .filter((employee: any) => employee.Position?.name !== "Team Leader")
        .filter((employee: any) => employee.Position?.name !== "Recorder")
        .filter((employee: any) => employee.Position?.name !== "Administrator")
        .filter((employee: any) => employee.Position?.name !== "Inspector");
      setWorkExperts(workExperts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingWorkExperts(false);
    }
  };

  const handelServiceRequestIdChange = (value: any) => {
    form.setFieldError("faults", null);
    form.setFieldValue("serviceRequestId", value);

    const serviceRequest: any = serviceRequests.find(
      (serviceRequest: any) => serviceRequest.id === parseInt(value)
    );
    if (serviceRequest) {
      setSelectedServiceRequestFaults(
        serviceRequest.faults.filter((fault: any) => !fault.workOrderId)
      );
    }
  };

  const handleWorkDepartmentChange = (value: any) => {
    form.setFieldError("workDepartment", null);
    form.setFieldValue("workDepartment", value);
    fetchWorkExperts();
  };

  const handleServiceTypeChange = (value: any) => {
    form.setFieldError("serviceType", null);
    form.setFieldValue("serviceType", value);
    form.setFieldValue("workDepartment", "");
    form.setFieldValue("expertId", "");
    form.setFieldValue("maintenanceType", "");
    form.setFieldValue("maintenanceLocation", "");
    form.setFieldValue("crashAccident", false);
    form.setFieldValue("insurance", false);
  };

  const serviceRequestsData = useMemo(
    () =>
      serviceRequests.map((serviceRequest: any) => ({
        value: `${serviceRequest.id}`,
        label: `${serviceRequest.id}`,
      })),
    [serviceRequests]
  );

  const workExpertsData = useMemo(
    () =>
      workExperts.map((workExpert: any) => ({
        value: `${workExpert.id}`,
        label: `${workExpert.firstName} ${workExpert.lastName}`,
        position: `${workExpert.Position?.name}`,
      })),
    [workExperts]
  );

  const serviceRequestFaultsData = useMemo(
    () =>
      selectedServiceRequestFaults.map((fault: any) => ({
        value: `${fault.id}`,
        label: `${fault.description}`,
      })),
    [selectedServiceRequestFaults]
  );

  const workDepartmentData = [
    { value: "Mechanical", label: "Mechanical" },
    { value: "Electrical", label: "Electrical" },
    { value: "Body", label: "Body" },
  ];

  const serviceTypeData = [
    { value: "out-source", label: "Out Source" },
    { value: "in-house", label: "In House" },
  ];

  const workOrderTypeData = [
    { value: "regular", label: "Regular" },
    { value: "project", label: "Project" },
  ];

  const maintenanceTypeData = [
    { value: "preventive", label: "Preventive" },
    { value: "corrective", label: "Corrective" },
  ];

  const maintenanceLocationData = [
    { value: "in-garage", label: "In Garage" },
    { value: "on-field", label: "On Field" },
    { value: "on-road", label: "On Road" },
  ];

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  if (loadingServiceRequests)
    return (
      <Container size="xs" py={70}>
        <Stack align="center" sx={{ height: "100%" }}>
          <Text color="dimmed">Loading...</Text>
          <Loader variant="oval" />
        </Stack>
      </Container>
    );

  if (serviceRequests.length === 0)
    return (
      <Container size="xs" py={70}>
        <Stack align="center" sx={{ height: "100%" }} spacing="xs">
          <Title order={3}>No Service Request Found</Title>
          <Text color="dimmed" sx={{ textAlign: "center" }}>
            This is because either you are not assigned to any service request
            or you didn't accepted any of the service requests you are assigned
            to.
          </Text>
        </Stack>
      </Container>
    );

  return (
    <Container py={30}>
      <form>
        <Stepper
          active={activeStepper}
          onStepClick={setActiveStepper}
          sx={{
            ".mantine-Stepper-content": {
              padding: "60px 30px 20px 30px",
              minHeight: 300,
            },
          }}
          size="md"
        >
          <Stepper.Step
            label="First step"
            description="Service Request and Faults Details"
            allowStepSelect={false}
          >
            <Grid>
              <Grid.Col span={6} offset={3}>
                <Select
                  required
                  label="Service Request Number"
                  name="serviceRequestId"
                  placeholder="Select Service Request Number"
                  value={form.values.serviceRequestId}
                  onChange={(e: any) => handelServiceRequestIdChange(e)}
                  data={serviceRequestsData}
                  error={form.errors.serviceRequestId}
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={6} offset={3}>
                {form.values.serviceRequestId !== "" ? (
                  selectedServiceRequestFaults.length === 0 ? (
                    <Stack align="center" sx={{ height: "100%" }} spacing="xs">
                      <Title order={4}>
                        Can't create Work Order for this Service Request
                      </Title>
                      <Text color="dimmed" sx={{ textAlign: "center" }}>
                        This is because all of the selected service request
                        faults are already assigned to a work order.
                      </Text>
                    </Stack>
                  ) : (
                    <MultiSelect
                      required
                      label="Faults"
                      name="faults"
                      placeholder="Select Faults"
                      {...form.getInputProps("faults")}
                      data={serviceRequestFaultsData}
                      size="md"
                    />
                  )
                ) : null}
              </Grid.Col>
            </Grid>
          </Stepper.Step>
          <Stepper.Step
            label="Second step"
            description="Work Type & Service Type Details"
            allowStepSelect={false}
          >
            <Grid>
              <Grid.Col span={6} offset={3}>
                <Select
                  required
                  label="Work Order Type"
                  name="type"
                  placeholder="Select Work Order Type"
                  {...form.getInputProps("type")}
                  data={workOrderTypeData}
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={6} offset={3}>
                <Select
                  required
                  label="Service Type"
                  name="serviceType"
                  placeholder="Select Service Type"
                  value={form.values.serviceType}
                  onChange={(e: any) => handleServiceTypeChange(e)}
                  data={serviceTypeData}
                  size="md"
                  error={form.errors.serviceType}
                />
              </Grid.Col>
            </Grid>
          </Stepper.Step>
          <Stepper.Step
            label="Final step"
            description="Maintenance and Work Details"
            allowStepSelect={false}
          >
            <Grid>
              {form.values.serviceType === "in-house" && (
                <>
                  <Grid.Col span={6}>
                    <Select
                      required
                      label="Work Department"
                      name="workDepartment"
                      placeholder="Select Work Department"
                      value={form.values.workDepartment}
                      onChange={(e: any) => handleWorkDepartmentChange(e)}
                      data={workDepartmentData}
                      size="md"
                      error={form.errors.workDepartment}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      required
                      label="Work Expert"
                      name="expertId"
                      placeholder="Select Work Expert"
                      {...form.getInputProps("expertId")}
                      data={workExpertsData}
                      size="md"
                      icon={
                        loadingWorkExperts && (
                          <Loader variant="oval" size={15} color="dark" />
                        )
                      }
                      disabled={workExperts.length === 0}
                      itemComponent={SelectItem}
                      searchable
                    />
                  </Grid.Col>
                </>
              )}
              <>
                <Grid.Col
                  span={6}
                  offset={
                    form.values.serviceType === "out-source" ? 3 : undefined
                  }
                >
                  <Select
                    required
                    label="Maintenance Type"
                    name="maintenanceType"
                    placeholder="Select Maintenance Type"
                    {...form.getInputProps("maintenanceType")}
                    data={maintenanceTypeData}
                    size="md"
                  />
                </Grid.Col>
                {form.values.serviceType === "in-house" && (
                  <Grid.Col span={6}>
                    <Select
                      required
                      label="Maintenance Location"
                      name="maintenanceLocation"
                      placeholder="Select Maintenance Location"
                      {...form.getInputProps("maintenanceLocation")}
                      data={
                        form.values.maintenanceType === "preventive"
                          ? maintenanceLocationData.filter(
                              (locationData: any) =>
                                locationData.value === "in-garage"
                            )
                          : maintenanceLocationData
                      }
                      size="md"
                    />
                  </Grid.Col>
                )}
                <Grid.Col
                  span={6}
                  offset={
                    form.values.serviceType === "out-source" ? 3 : undefined
                  }
                >
                  <Grid>
                    {form.values.maintenanceType === "corrective" && (
                      <Grid.Col span={6}>
                        <Checkbox
                          label="Crash Accident"
                          size="sm"
                          checked={form.values.crashAccident}
                          onChange={(e: any) =>
                            form.setFieldValue(
                              "crashAccident",
                              e.currentTarget.checked
                            )
                          }
                          sx={{
                            alignItems: "flex-end",
                            height: "100%",
                            "& .mantine-Checkbox-inner": {
                              marginBottom: 1,
                            },
                          }}
                        />
                      </Grid.Col>
                    )}
                    <Grid.Col span={6}>
                      {form.values.serviceType === "out-source" &&
                        form.values.maintenanceType === "corrective" && (
                          <Checkbox
                            label="Insurance Covered"
                            size="sm"
                            checked={form.values.insurance}
                            onChange={(e: any) =>
                              form.setFieldValue(
                                "insurance",
                                e.currentTarget.checked
                              )
                            }
                            sx={{
                              alignItems: "flex-end",
                              height: "100%",
                              "& .mantine-Checkbox-inner": {
                                marginBottom: 1,
                              },
                            }}
                          />
                        )}
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </>
            </Grid>
          </Stepper.Step>
          <Stepper.Completed>
            <Grid>
              <Grid.Col span={8} offset={2}>
                <Grid gutter={10}>
                  {Object.entries(form.values).map(([key, value]: any) => {
                    if (key === "faults")
                      return (
                        <Grid.Col span={12} key={key}>
                          <Stack
                            sx={(theme) => ({
                              boxShadow: theme.shadows.xs,
                              // backgroundColor: theme.colors.gray[0],
                              gap: 0,
                              padding: 5,
                            })}
                          >
                            <Text
                              sx={{ textTransform: "capitalize" }}
                              size="md"
                              weight={600}
                              color="gray"
                            >
                              {key}
                            </Text>
                            <List size="sm">
                              {value.map((fault: any, i: number) => (
                                <List.Item key={i}>
                                  {
                                    selectedServiceRequestFaults.find(
                                      (faultObj: any) =>
                                        faultObj.id === parseInt(fault)
                                    )["description"]
                                  }
                                </List.Item>
                              ))}
                            </List>
                          </Stack>
                        </Grid.Col>
                      );
                    if (key === "crashAccident" || key === "insurance")
                      return (
                        <Grid.Col span={4} key={key}>
                          <Stack
                            sx={(theme) => ({
                              boxShadow: theme.shadows.xs,
                              // backgroundColor: theme.colors.gray[0],
                              gap: 0,
                              padding: 5,
                            })}
                          >
                            <Text
                              sx={{ textTransform: "capitalize" }}
                              size="md"
                              weight={600}
                              color="gray"
                            >
                              {key}
                            </Text>
                            <Text size="sm">{value ? "Yes" : "No"}</Text>
                          </Stack>
                        </Grid.Col>
                      );

                    if (
                      key !== "crashAccident" &&
                      key !== "insurance" &&
                      key !== "faults" &&
                      value === ""
                    )
                      return null;
                    return (
                      <Grid.Col span={4} key={key}>
                        <Stack
                          sx={(theme) => ({
                            boxShadow: theme.shadows.xs,
                            // backgroundColor: theme.colors.gray[0],
                            gap: 0,
                            padding: 5,
                          })}
                        >
                          <Text
                            sx={{ textTransform: "capitalize" }}
                            size="md"
                            weight={600}
                            color="gray"
                          >
                            {key}
                          </Text>
                          <Text size="sm">{value}</Text>
                        </Stack>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Grid.Col>
            </Grid>
          </Stepper.Completed>
        </Stepper>
      </form>

      <Group position="center" mt="xl">
        <Button
          variant="default"
          onClick={() => navigateStepper("prev")}
          disabled={activeStepper === 0}
        >
          Back
        </Button>
        {activeStepper < 3 && (
          <Button
            onClick={() => navigateStepper("next")}
            disabled={
              form.values.serviceRequestId !== "" &&
              selectedServiceRequestFaults.length === 0
            }
          >
            Save and Continue
          </Button>
        )}
        {activeStepper === 3 && (
          <Button
            onClick={createWorkOrder}
            disabled={
              form.values.serviceRequestId !== "" &&
              selectedServiceRequestFaults.length === 0
            }
            loading={creatingWorkOrder}
          >
            Create Work Order
          </Button>
        )}

        <Button onClick={() => closeModal()} variant="default">
          Cancel
        </Button>
      </Group>
    </Container>
  );
}

export default CreateWorkOrder;
