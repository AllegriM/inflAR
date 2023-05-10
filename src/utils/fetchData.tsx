// Obtain data from API
export const fetchApi = async (): Promise<IPCProps[]> => {
  const response = await fetch(
    // "/src/data/ipc.json",
    "https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&limit=5000",
  );
  const {data} = await response.json();
  const newData = data.map((item: [string, number]) => {
    return {
      fecha: item[0],
      IPC: item[1],
    };
  });

  return newData;
};
