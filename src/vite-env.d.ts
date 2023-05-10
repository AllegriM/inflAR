/// <reference types="vite/client" />

interface IPCProps {
  fecha: string;
  IPC: number;
}

interface infletaResults {
  inflacion: number;
  valor: number;
}

interface ConversionProps {
  monto: number;
  añoCompra: number;
  mesCompra: string;
  añoActual: number;
  mesActual: string;
}

interface Mes {
  name: string;
  number: string;
}
