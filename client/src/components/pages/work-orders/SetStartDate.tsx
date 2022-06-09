import { createStyles } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { RadioGroup } from "@mantine/core";
import { Group } from "@mantine/core";
import { Stack } from "@mantine/core";
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
  startDate?: string;
  serviceType?: string;
}

function SetStartDate({ workOrder, setUpdate, closeModal }: any) {
  const [loading, setLoading] = useState(false);
  const { start } = useWorkOrdersService();
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [typeValue, setTypeValue] = useState("");
  const [error, setErrors] = useState<any>({});
  const theme = useMantineTheme();

  const { classes, cx } = useStyles();

  const handleSet = async () => {
    console.log(dateValue, typeValue);

    try {
      setLoading(true);
      await validateValues();
      await start(workOrder.id, {
        startDate: dateValue,
      });
      setUpdate(`${Math.random()} updated`);
      closeModal();
      showNotification({
        title: "Work Order Started",
        message: `Work Order with id ${workOrder.id} has started successfully`,
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
      errors.push({ path: "startDate", message: "Start Date is required" });

    if (Object.keys(errors).length > 0) return Promise.reject(errors);

    Promise.resolve();
  };

  useEffect(() => {
    if (workOrder.startDate) setDateValue(new Date(workOrder.startDate));
  }, [workOrder]);

  return (
    <>
      <Stack>
        <DatePicker
          placeholder="Pick Start Date"
          label="Start Date"
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
          error={error.startDate && error.startDate}
        />
        <RadioGroup
          label="Service Type"
          required
          size="md"
          value={typeValue}
          onChange={setTypeValue}
          error={error.serviceType && error.serviceType}
        >
          <Radio value="in-house" label="In House" />
          <Radio value="out-source" label="Out Source" />
        </RadioGroup>
        <Button size="md" loading={loading} onClick={handleSet}>
          Set
        </Button>
      </Stack>
    </>
  );
}

export default SetStartDate;
