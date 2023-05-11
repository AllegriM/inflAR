import {useEffect, useState} from "react";

import {fetchApi} from "../utils/fetchData";

export const useData = () => {
  const [data, setData] = useState<IPCProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
      const data = await fetchApi();

      setData(data);
    } catch (e) {
      throw new Error("Error al obtener los datos del IPC");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return {data, loading, getData};
};
