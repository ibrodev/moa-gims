import useAxiosPrivate from "../useAxiosPrivate";

const useVehiclesService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/vehicles");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getTypes = async () => {
    try {
      const response = await axiosPrivate.get("/vehicles/types", {
        withCredentials: true,
      });
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (VehicleData) => {
    try {
      const response = await axiosPrivate.post("/vehicles", VehicleData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, VehicleData) => {
    try {
      const response = await axiosPrivate.put(`/users/${id}`, VehicleData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  // const destroy = async (id) => {
  //   try {
  //     const response = await axiosPrivate.delete(`/users/${id}`, {
  //       withCredentials: true,
  //     });

  //     return Promise.resolve(response.data);
  //   } catch (error) {
  //     if (error.response?.status === 400)
  //       return Promise.reject(error.response.data.errors);
  //   }
  // };

  return { getAll, create, update, getTypes };
};

export default useVehiclesService;
