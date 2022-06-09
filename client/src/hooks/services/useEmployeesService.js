import useAxiosPrivate from "../useAxiosPrivate";

const useEmployeesService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/employees");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (employeeData) => {
    try {
      const response = await axiosPrivate.post("/employees", employeeData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, employeeData) => {
    try {
      const response = await axiosPrivate.put(
        `/employees/${id}`,
        employeeData,
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
      const response = await axiosPrivate.delete(`/employees/${id}`, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const count = async () => {
    try {
      const response = await axiosPrivate.get("/employees/count");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { getAll, create, update, count, destroy };
};

export default useEmployeesService;
