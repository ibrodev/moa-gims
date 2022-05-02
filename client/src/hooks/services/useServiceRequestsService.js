import useAxiosPrivate from "../useAxiosPrivate";

const useServiceRequestsService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/service-requests");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (serviceRequestsData) => {
    try {
      const response = await axiosPrivate.post(
        "/service-requests",
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

  const update = async (id, serviceRequestData) => {
    try {
      const response = await axiosPrivate.put(
        `/service-requests/${id}`,
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

  const destroy = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/service-requests/${id}`, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const updateOdometerReading = async (id, odometerReading) => {
    try {
      const response = await axiosPrivate.put(
        `/service-requests/${id}/update-odometer-reading`,
        odometerReading,
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

  const assignInspector = async (id, inspectorId) => {
    try {
      const response = await axiosPrivate.put(
        `/service-requests/${id}/assign-inspector`,
        inspectorId,
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

  const accept = async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/service-requests/${id}/accept`,
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

  return {
    getAll,
    create,
    update,
    destroy,
    updateOdometerReading,
    assignInspector,
    accept,
  };
};

export default useServiceRequestsService;
