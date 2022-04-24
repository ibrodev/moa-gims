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

  return { create, getAll };
};

export default useEmployeesService;
