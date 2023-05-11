// Obtain data from API
export const fetchApi = async (): Promise<IPCProps[]> => {
  const response = await fetch(
    // "/src/data/ipc.json",
    import.meta.env.VITE_API_URL as string,
  );
  const {data} = await response.json();

  const newData = data?.map((item: [string, number]) => {
    return {
      fecha: item[0],
      IPC: item[1],
    };
  });

  return newData;
};
