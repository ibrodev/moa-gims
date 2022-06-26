import {
  Box,
  createStyles,
  Divider,
  Grid,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";
import { forwardRef } from "react";

const useStyles = createStyles((theme) => ({
  page: {},
  p: {
    fontSize: "10pt",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headerTitle: {
    color: theme.colors.gray[6],
    fontSize: "18pt",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "14pt",
  },
  section: {
    "& .section-title": {
      margin: "12pt 0 6pt 0",
      fontSize: "14pt",
    },
  },

  table: {
    fontSize: "10pt",
    "& th": {
      fontWeight: "normal",
    },
  },
}));

function PrintRequestReport(props: any, ref: any) {
  const { classes } = useStyles();
  return (
    <Box ref={ref} classNames={classes.page} component={"main"}>
      <Box component={"header"} className={classes.header}>
        <Text className={classes.headerTitle}>Ministry of Agriculture</Text>
        <Text className={classes.headerSubtitle}>
          Service Request Completion Report
        </Text>
      </Box>
      <Box component={"section"} className={classes.section}>
        <Text className="section-title">Request Details</Text>

        <Group position="apart">
          <Text className={classes.p}>Service Request No</Text>
          <Text className={classes.p} underline>
            {props.serviceRequest?.id}
          </Text>
        </Group>

        <Group position="apart">
          <Text className={classes.p}>Vehicle Plate No</Text>
          <Text className={classes.p} underline>
            {props.serviceRequest?.Vehicle.plateNo}
          </Text>
        </Group>

        <Group position="apart">
          <Text className={classes.p}>Odometer Reading</Text>
          <Text className={classes.p} underline>
            {numeral(props.serviceRequest?.odometerReading).format("0,0")}
            {" km"}
          </Text>
        </Group>

        <Group position="apart">
          <Text className={classes.p}>Driver</Text>
          <Text className={classes.p} underline>
            {props.serviceRequest?.Driver.firstName}{" "}
            {props.serviceRequest?.Driver.lastName}
          </Text>
        </Group>

        <Group position="apart">
          <Text className={classes.p}>Inspector</Text>
          <Text className={classes.p} underline>
            {props.serviceRequest?.Employee.firstName}{" "}
            {props.serviceRequest?.Employee.lastName}
          </Text>
        </Group>

        <Group position="apart">
          <Text className={classes.p}>Department</Text>
          <Text className={classes.p} underline>
            {props.serviceRequest?.Department.name}
          </Text>
        </Group>
      </Box>
      <Box component={"section"} className={classes.section}>
        <Text className="section-title">Work Details</Text>
        {props.serviceRequest?.WorkOrders.map((workOrder: any) => (
          <Box mb="12pt">
            <Group position="left">
              <Text className={classes.p}>Work Order No:</Text>
              <Text className={classes.p} underline>
                {workOrder.type === "project" ? "P" : "R"}/{workOrder.id}/
                {moment(workOrder.createdAt).year()}
              </Text>
            </Group>
            <Divider variant="solid" size="sm" />
            <Grid gutter="xl">
              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Service Type</Text>
                  <Text className={classes.p} underline>
                    {_.startCase(_.camelCase(workOrder.serviceType))}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Started On</Text>
                  <Text className={classes.p} underline>
                    {moment(workOrder.startDate).format("MMM DD, YYYY")}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Completed On</Text>
                  <Text className={classes.p} underline>
                    {moment(workOrder.endDate).format("MMM DD, YYYY")}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Maintenance Type</Text>
                  <Text className={classes.p} underline>
                    {_.capitalize(workOrder.maintenanceType)}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
            <Grid gutter="xl">
              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Service Cost</Text>
                  <Text className={classes.p} underline>
                    {workOrder.serviceCost
                      ? numeral(workOrder.serviceCost).format("0,0.00")
                      : "N/A"}
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Work Department</Text>
                  <Text className={classes.p} underline>
                    {workOrder.workDepartment
                      ? _.capitalize(workOrder.workDepartment)
                      : "N/A"}
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col span={3}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Work Expert</Text>
                  <Text className={classes.p} underline>
                    {workOrder.Employee
                      ? _.capitalize(workOrder.Employee?.firstName) +
                        " " +
                        _.capitalize(workOrder.Employee?.lastName)
                      : "N/A"}
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
            <Grid gutter="xl">
              <Grid.Col span={6}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Recorded Fault\s</Text>
                  {workOrder.Faults.map((fault: any) => (
                    <Text className={classes.p} underline>
                      {"- "}
                      {fault.description}
                    </Text>
                  ))}
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Performed Task\s</Text>
                  {workOrder.PerformedTasks.map((task: any) => (
                    <Text className={classes.p} underline>
                      {"- "}
                      {task.description}
                    </Text>
                  ))}
                </Stack>
              </Grid.Col>
              <Grid.Col span={12}>
                <Stack sx={{ gap: 0 }}>
                  <Text className={classes.p}>Spare Part\s</Text>
                  {workOrder.SpareParts.length > 0 ? (
                    <Table verticalSpacing={0} className={classes.table}>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Part Number</th>
                          <th>Part Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workOrder.SpareParts.map(
                          (sparePart: any, index: number) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{sparePart.partNumber}</td>
                              <td>{sparePart.partName}</td>
                              <td>{sparePart.quantity}</td>
                              <td>
                                {numeral(sparePart.unitPrice).format("0,0.00")}
                              </td>
                              <td>
                                {numeral(
                                  sparePart.quantity * sparePart.unitPrice
                                ).format("0,0.00")}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={5}>Grand Total</th>
                          <th>
                            {numeral(
                              workOrder.SpareParts?.reduce(
                                (
                                  prv: any,
                                  current: any,
                                  currentI: any,
                                  array: any
                                ) => prv + current.unitPrice * current.quantity,
                                0
                              )
                            ).format("0,0.00")}
                          </th>
                        </tr>
                      </tfoot>
                    </Table>
                  ) : (
                    <Text className={classes.p}>No Spare Parts</Text>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
            <Divider variant="dotted" size="sm" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default forwardRef(PrintRequestReport);
