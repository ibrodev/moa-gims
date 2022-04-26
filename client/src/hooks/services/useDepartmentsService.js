import useAxiosPrivate from "../useAxiosPrivate";

const useDepartmentsService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/departments");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (departmentData) => {
    try {
      const response = await axiosPrivate.post("/departments", departmentData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, departmentData) => {
    try {
      const response = await axiosPrivate.put(
        `/departments/${id}`,
        departmentData,
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
      const response = await axiosPrivate.delete(`/departments/${id}`, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  return { getAll, create, update, destroy };
};

export default useDepartmentsService;
