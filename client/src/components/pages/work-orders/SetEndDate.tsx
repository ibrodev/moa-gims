import { createStyles } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { RadioGroup } from "@mantine/core";
import { Group } from "@mantine/core";
import { Stack } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Radio } from "@mantine/core";
import { Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Calendar, Check } from "tabler-icons-react";
import useWorkOrdersService from "../../../hooks/services/useWorkOrdersService";
import _ from "lodash";

const useStyles = createStyles((theme) => ({
  selected: {
    backgroundColor: `${theme.colors.blue[8]} !important`,
    color: `${theme.white} !important`,
  },
}));

interface valuesErrorI {
  path?: string;
  message?: string;
}

function SetEndDate({ workOrder, setUpdate, closeModal }: any) {
  const [loading, setLoading] = useState(false);
  const { end } = useWorkOrdersService();
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [costValue, setCostValue] = useState<number | undefined>();
  const [error, setErrors] = useState<any>({});
  const theme = useMantineTheme();

  const { classes, cx } = useStyles();

  const handleSet = async () => {
    try {
      setLoading(true);
      await validateValues();
      await end(workOrder.id, {
        endDate: dateValue,
        serviceCost: costValue,
      });
      setUpdate(`${Math.random()} updated`);
      closeModal();
      showNotification({
        title: "Work Order Ended",
        message: `End Date of a Work Order with id ${workOrder.id} registered successfully`,
        icon: <Check size={18} />,
      });
    } catch (errors: any) {
      errors.forEach((error: any) =>
        setErrors((prev: any) => ({
          ...prev,
          [_.camelCase(error.path)]: error.message,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const validateValues = async () => {
    let errors = [];
    if (!dateValue)
      errors.push({ path: "endDate", message: "End Date is Required" });

    if (Object.keys(errors).length > 0) return Promise.reject(errors);

    Promise.resolve();
  };

  useEffect(() => {
    if (workOrder.endDate) setDateValue(new Date(workOrder.endDate));
    if (workOrder.serviceCost) setCostValue(workOrder.serviceCost);
  }, [workOrder]);

  return (
    <>
      <Stack>
        <DatePicker
          placeholder="Pick Date"
          label="End Date"
          required
          value={dateValue}
          onChange={setDateValue}
          allowLevelChange={false}
          excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
          dayStyle={(date) =>
            date.toDateString() === new Date().toDateString()
              ? { backgroundColor: theme.colors.blue[3], color: theme.white }
              : {}
          }
          dayClassName={(date, modifiers) =>
            cx({
              [classes.selected]: modifiers.selected,
            })
          }
          clearable={false}
          size="md"
          icon={<Calendar size={16} />}
          error={error.endDate && error.endDate}
        />
        {workOrder.serviceType === "out-source" && (
          <NumberInput
            required={workOrder.serviceType === "out-source"}
            value={costValue}
            onChange={(val) => setCostValue(val)}
            label="Service Cost"
            precision={2}
            hideControls
            size="md"
            error={error.serviceCost && error.serviceCost}
          />
        )}
        <Button size="md" loading={loading} onClick={handleSet}>
          Set
        </Button>
      </Stack>
    </>
  );
}

export default SetEndDate;
