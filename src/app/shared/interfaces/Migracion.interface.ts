export interface Migracion{
  id:number;
  clienteOrigen: string,
  clienteDestino: string,
  fechaHoraInicioOperacion: string,
  fechaHoraFinOperacion: string,
  operacion: string,
  resultado: string,
  descripcion: string
}
