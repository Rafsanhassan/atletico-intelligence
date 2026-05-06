import { useEffect, useState } from "react";
import api from "../api/axios";

const useApi = (endpoint, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(endpoint);
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to fetch data.");
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint, ...deps]);

  return { data, loading, error };
};

export default useApi;
