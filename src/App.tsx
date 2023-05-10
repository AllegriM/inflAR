import {ChangeEvent, useEffect, useState} from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from "recharts";

import {fetchApi} from "./utils/fetchData";
import {months, years} from "./constants/constants";
import useResults from "./hooks/useResults";

function App() {
  const [data, setData] = useState<IPCProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [conversionData, setConversionData] = useState<ConversionProps>({
    monto: 0,
    añoCompra: 2017,
    añoActual: 2017,
    mesCompra: "01",
    mesActual: "02",
  });

  const infletaResults = useResults(conversionData, data);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchApi();

      setData(data);
      setLoading(false);
    };

    getData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {value, name} = e.target;

    setConversionData({
      ...conversionData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-screen">
      {loading && <h1>Loading...</h1>}
      {!loading && data && (
        <div className="flex justify-center items-center h-full gap-10">
          <LineChart
            data={data}
            height={300}
            margin={{top: 5, right: 20, bottom: 5, left: 0}}
            width={600}
          >
            <Line dataKey="IPC" stroke="#8884d8" type="monotone" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="fecha" />
            <YAxis dataKey="IPC" />
            <Tooltip />
          </LineChart>
          <div className="flex flex-col">
            <form className="flex flex-col">
              <label className="text-lg" htmlFor="monto">
                Cuanto pagaste por ese producto:{" "}
              </label>
              <input
                className="rounded-md px-2 py-1"
                id="monto"
                name="monto"
                type="number"
                onChange={handleChange}
              />
              <label htmlFor="fecha-desde">Fecha desde:</label>
              <div className="flex gap-2">
                <select
                  className="rounded-md px-2 py-1 w-2/3"
                  id="fecha-desde"
                  name="mesCompra"
                  onChange={handleChange}
                >
                  {Object.values(months).map((month) => {
                    return (
                      <option key={month.number} value={month.number}>
                        {month.name}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="rounded-md px-2 py-1 w-1/3"
                  name="añoCompra"
                  onChange={handleChange}
                >
                  {years.map((year) => {
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label htmlFor="fecha-hasta">Fecha hasta:</label>
              <div className="flex gap-2">
                <select
                  className="rounded-md px-2 py-1 w-2/3"
                  id="fecha-hasta"
                  name="mesActual"
                  onChange={handleChange}
                >
                  {Object.values(months).map((month) => {
                    const monthExistsInYear = data.some(
                      (data) => data.fecha === `${conversionData.añoActual}-${month.number}-01`,
                    );

                    return (
                      <option key={month.number} disabled={!monthExistsInYear} value={month.number}>
                        {month.name}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="rounded-md px-2 py-1 w-1/3"
                  name="añoActual"
                  onChange={handleChange}
                >
                  {years.map((year) => {
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </form>
            <div>
              <p>Hoy pagarias por ese producto: </p>
              <h3 className="text-3xl font-semibold">$ {infletaResults.valor.toFixed(2)}</h3>
            </div>
            <span>La inflacion hasta la fecha es de:</span>
            <p className="text-2xl text-red-800 font-semibold">
              {" "}
              %{infletaResults.inflacion.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
