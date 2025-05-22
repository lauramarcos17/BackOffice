export interface Migracion{
  clienteOrigen: string,
  clienteDestino: string,
  fechaHoraInicioOperacion: string,
  fechaHoraFinOperacion: string,
  operacion: string,
  resultado: string,
  descripcion: string
}