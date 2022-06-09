import useAxiosPrivate from "../useAxiosPrivate";

const useDriversService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/drivers");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (driverData) => {
    try {
      const response = await axiosPrivate.post("/drivers", driverData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, driverData) => {
    try {
      const response = await axiosPrivate.put(`/drivers/${id}`, driverData, {
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
      const response = await axiosPrivate.get("/drivers/count", {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { getAll, create, update, count };
};

export default useDriversService;
