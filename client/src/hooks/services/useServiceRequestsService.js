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

  const getById = async (id) => {
    try {
      const response = await axiosPrivate.get(`/service-requests/${id}`);
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (data) => {
    try {
      const response = await axiosPrivate.post("/service-requests", data, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, data) => {
    try {
      const response = await axiosPrivate.put(`/service-requests/${id}`, data, {
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
      const response = await axiosPrivate.delete(`/service-requests/${id}`, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const assignInspector = async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/service-requests/${id}/assign-inspector`,
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

  const accept = async (id, data) => {
    try {
      const response = await axiosPrivate.put(
        `/service-requests/${id}/accept`,
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

  const addFaults = async (id, data) => {
    try {
      const response = await axiosPrivate.post(
        `service-requests/${id}/faults`,
        { faults: data },
        { withCredentials: true }
      );
      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const deleteFaults = async (id, data) => {
    try {
      const response = await axiosPrivate.delete(
        `/service-requests/${id}/faults`,
        { data },
        { withCredentials: true }
      );
      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    destroy,
    assignInspector,
    accept,
    addFaults,
    deleteFaults,
  };
};

export default useServiceRequestsService;
