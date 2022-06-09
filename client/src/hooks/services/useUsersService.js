import useAxiosPrivate from "../useAxiosPrivate";

const useUsersService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAll = async () => {
    try {
      const response = await axiosPrivate.get("/users");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const create = async (userData) => {
    try {
      const response = await axiosPrivate.post("/users", userData, {
        withCredentials: true,
      });

      return Promise.resolve(response.data);
    } catch (error) {
      if (error.response?.status === 400)
        return Promise.reject(error.response.data.errors);
    }
  };

  const update = async (id, userData) => {
    try {
      const response = await axiosPrivate.put(`/users/${id}`, userData, {
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
      const response = await axiosPrivate.delete(`/users/${id}`, {
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
      const response = await axiosPrivate.get("/users/count");
      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const resetPassword = async (id, password) => {
    try {
      const response = await axiosPrivate.put(
        `/users/${id}/reset-password`,
        password,
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
  return { getAll, create, update, destroy, count, resetPassword };
};

export default useUsersService;
