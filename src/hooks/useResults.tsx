import {useMemo, useState} from "react";

export default function useResults(conversionData: ConversionProps, data: IPCProps[]) {
  const [infletaResults, setInfletaResults] = useState<infletaResults>({
    inflacion: 0,
    valor: 0,
  });

  const fechaCompra = `${conversionData.añoCompra}-${conversionData.mesCompra}-01`;
  const actualCompra = `${conversionData.añoActual}-${conversionData.mesActual}-01`;

  useMemo(() => {
    const compraData = data?.find((item) => item.fecha === fechaCompra);

    const actualData = data?.find((item) => item.fecha === actualCompra);

    if (actualData && compraData) {
      const inflacion = ((actualData?.IPC - compraData?.IPC) / compraData?.IPC) * 100;
      const VALOR_ACTUALIZADO = conversionData.monto * (actualData?.IPC / compraData?.IPC);

      setInfletaResults({
        inflacion,
        valor: VALOR_ACTUALIZADO,
      });
    }
  }, [fechaCompra, actualCompra, conversionData, data]);

  if (new Date(fechaCompra) > new Date(actualCompra)) {
    return {
      inflacion: 0,
      valor: 0,
    };
  }

  return infletaResults;
}
