import useAxiosPrivate from "../useAxiosPrivate";

const usePositionsService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/positions");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (positionData) => {
    try {
      const response = await axiosPrivate.post("/positions", positionData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, positionData) => {
    try {
      const response = await axiosPrivate.put(
        `/positions/${id}`,
        positionData,
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

  return { getAll, create, update };
};

export default usePositionsService;
