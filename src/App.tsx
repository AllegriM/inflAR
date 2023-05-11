import {ChangeEvent, useState} from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from "recharts";

import {months, years} from "./constants/constants";
import useResults from "./hooks/useResults";
import {useData} from "./hooks/useData";
import Loading from "./components/Loading";

function App() {
  const {data, loading} = useData();
  const [conversionData, setConversionData] = useState<ConversionProps>({
    monto: 0,
    añoCompra: 2017,
    añoActual: 2017,
    mesCompra: "01",
    mesActual: "02",
  });
  const infletaResults = useResults(conversionData, data);

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {value, name} = e.target;

    setConversionData({
      ...conversionData,
      [name]: value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-screen">
      {loading && <Loading />}
      {!loading && data && (
        <div className="relative flex flex-col lg:flex-row justify-center items-center lg:h-full gap-10">
          <div className="flex flex-col mx-auto md:mx-0">
            <h2 className="py-4 md:py-2 text-3xl font-bold font-serif text-center">
              💸 Infleta Graph
            </h2>
            <LineChart
              data={data}
              height={300}
              // margin={{top: 5, right: 10, bottom: 5, left: 0}}
              // Responsive width
              width={window.innerWidth > 768 ? 500 : window.innerWidth - 20}
            >
              <Line dataKey="IPC" stroke="#8884d8" type="monotone" />
              <CartesianGrid stroke="#ccc" strokeDasharray="0" />
              <XAxis dataKey="fecha" />
              <YAxis dataKey="IPC" />
              <Tooltip />
            </LineChart>
            <p className="text-gray-500 px-2 md:pl-14 md:w-[500px]">
              Los datos son obtenidos de la base de datos de{" "}
              <span className="text-red-700">INDEC</span> y se actualizan automaticamente cada mes.
              Los datos son desde el año 2017 hasta el año actual.
            </p>
          </div>
          <div className="flex flex-col md:w-1/3">
            <form className="flex flex-col">
              <label className="text-lg" htmlFor="monto">
                Cuanto pagaste por ese producto:{" "}
              </label>
              <div className="relative">
                <input
                  className="bg-transparent border-b hover:cursor-pointer focus:border-red-700 focus-visible:outline-none pl-8 px-2 py-1 mb-4 text-2xl font-semibold"
                  id="monto"
                  name="monto"
                  type="number"
                  onChange={handleChange}
                />
                <span className="absolute left-2 top-5 transform -translate-y-1/2 text-3xl font-bold text-white">
                  $
                </span>
              </div>

              <label htmlFor="fecha-desde">Fecha desde:</label>
              <div className="flex gap-2 mb-4">
                <select
                  className="bg-transparent border-b hover:cursor-pointer focus:border-red-700 focus-visible:outline-none px-2 py-1 w-2/3"
                  id="fecha-desde"
                  name="mesCompra"
                  onChange={handleChange}
                >
                  {Object.values(months).map((month) => {
                    return (
                      <option key={month.number} className="bg-stone-700" value={month.number}>
                        {month.name}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="bg-transparent border-b hover:cursor-pointer focus:border-red-700 focus-visible:outline-none px-2 py-1 w-1/3"
                  name="añoCompra"
                  onChange={handleChange}
                >
                  {years.map((year) => {
                    return (
                      <option key={year} className="bg-stone-700" value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label htmlFor="fecha-hasta">Fecha hasta:</label>
              <div className="flex gap-2 mb-4">
                <select
                  className="bg-transparent border-b hover:cursor-pointer focus:border-red-700 focus-visible:outline-none px-2 py-1 md:w-2/3"
                  id="fecha-hasta"
                  name="mesActual"
                  onChange={handleChange}
                >
                  {Object.values(months).map((month) => {
                    const monthExistsInYear = data.some(
                      (data) => data.fecha === `${conversionData.añoActual}-${month.number}-01`,
                    );

                    return (
                      <option
                        key={month.number}
                        className="bg-stone-700"
                        disabled={!monthExistsInYear}
                        value={month.number}
                      >
                        {month.name}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="bg-transparent border-b hover:cursor-pointer focus:border-red-700 focus-visible:outline-none px-2 py-1 w-1/3"
                  name="añoActual"
                  onChange={handleChange}
                >
                  {years.map((year) => {
                    return (
                      <option key={year} className="bg-stone-700" value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </form>
            <div
              className={`transition-all ${
                infletaResults.error ? "opacity-100" : "opacity-0"
              } h-16`}
            >
              {infletaResults.error && (
                <div
                  className={`transition-all bg-red-400 font-semibold text-white p-4 rounded-lg`}
                >
                  No se puede ingresar una fecha inicial mayor a la final.
                </div>
              )}
            </div>
            <p className="text-2xl md:mt-6">A esa fecha estarias pagando: </p>
            <h3 className="text-4xl font-semibold pb-4">$ {infletaResults.valor.toFixed(2)}</h3>
            <span className="text-gray-600 pt-4">La inflacion hasta la fecha es de:</span>
            <p className="text-3xl text-red-800 font-semibold">
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
