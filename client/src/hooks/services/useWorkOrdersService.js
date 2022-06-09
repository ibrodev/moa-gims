import useAxiosPrivate from "../useAxiosPrivate";

const useWorkOrdersService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/work-orders");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (serviceRequestsData) => {
    try {
      const response = await axiosPrivate.post(
        "/work-orders",
        serviceRequestsData,
        {
          withCredentials: true,
        }
      );

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const getOne = async (workOrderId) => {
    try {
      const response = await axiosPrivate.get(
        `/work-orders/${workOrderId}`,

        {
          withCredentials: true,
        }
      );
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const update = async (id, serviceRequestData) => {
    try {
      const response = await axiosPrivate.put(
        `/work-orders/${id}`,
        serviceRequestData,
        {
          withCredentials: true,
        }
      );

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const start = async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/work-orders/${id}/start`,
        data,
        {
          withCredentials: true,
        }
      );

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const end = async (id, data) => {
    try {
      const response = await axiosPrivate.put(`/work-orders/${id}/end`, data, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const destroy = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/work-orders/${id}`, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const addFaults = async (id, faults) => {
    try {
      const response = await axiosPrivate.put(
        `/work-orders/${id}/add-faults`,
        { faults },
        {
          withCredentials: true,
        }
      );

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const addParts = async (id, parts) => {
    try {
      const response = await axiosPrivate.post(
        `/work-orders/${id}/add-parts`,
        parts,
        {
          withCredentials: true,
        }
      );

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const setComplete = async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/work-orders/${id}/complete`,
        data,
        {
          withCredentials: true,
        }
      );
      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const count = async () => {
    try {
      const response = await axiosPrivate.get("/work-orders/count");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    getAll,
    getOne,
    create,
    update,
    count,
    start,
    end,
    destroy,
    addParts,
    setComplete,
  };
};

export default useWorkOrdersService;
