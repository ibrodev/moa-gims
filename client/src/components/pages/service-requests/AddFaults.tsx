import { Textarea } from "@mantine/core";
import { Button } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, Plus, X } from "tabler-icons-react";
import useServiceRequestsService from "../../../hooks/services/useServiceRequestsService";

function AddFaults({ setActionDrawer, setNewServiceRequest, data }: any) {
  const [loading, setLoading] = useState(false);

  const { addFaults } = useServiceRequestsService();

  const form = useForm({
    initialValues: {
      faults: formList([{ description: "", key: randomId() }]),
    },
  });

  const fields = form.values.faults.map((fault: any, index: any) => (
    <Textarea
      key={fault.key}
      required
      label="Description"
      placeholder="Enter description"
      description={
        index !== 0 && (
          <ActionIcon
            color="red"
            onClick={() => form.removeListItem("faults", index)}
          >
            <X size={10} />
          </ActionIcon>
        )
      }
      autosize
      minRows={3}
      {...form.getListInputProps("faults", index, "description")}
    />
  ));

  const handleFromSubmit = async () => {
    console.log(form.values.faults.map((fault: any) => fault.description));

    try {
      setLoading(true);
      await addFaults(
        data.id,
        form.values.faults.map((fault: any) => fault.description)
      );
      setNewServiceRequest(randomId());
      setActionDrawer({ open: false });
      showNotification({
        title: "Faults Registered",
        message: `Faults registered successfully`,
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleFromSubmit)}>
        {fields}
        <ActionIcon
          sx={{ width: "100%" }}
          variant="filled"
          onClick={() =>
            form.addListItem("faults", { description: "", key: randomId() })
          }
          color="dark"
          my={10}
        >
          Add new fault filed
          <Plus size={15} style={{ marginLeft: 4 }} />
        </ActionIcon>
        <Button type="submit" loading={loading}>
          Add Faults
        </Button>
      </form>
    </>
  );
}

export default AddFaults;
