export interface ClienteJsonInterface {


  id:                number;
  idEmpresa:         string;
  nombre:            string;
  nif:               string;
  sufijo:            string;
  dirTipoVia:        string;
  dirNombreVia:      string;
  dirNumeroEdificio: string;
  dirRestoDireccion: string;
  dirCodigoPostal:   string;
  dirLocalidad:      string;
  dirProvincia:      string;
  dirIsoPais:        string;
  sct:               Sct;
  sdd:               Sdd;
  chk:               Chk;
}

export interface Chk {
  ordenantes: ChkOrdenante[];
}

export interface ChkOrdenante {
  id:                  string;
  empresaId:           string;
  nombre:              string;
  nif:                 string;
  gestionadoEntidad:   boolean;
  estado:              string;
  incrementalRemesa:   number;
  limiteMensual:       number;
  mensualAcumulado:    number;
  remesasChk:          RemesasChk[];
  libradores:          Libradore[];
  historicoRemesasChk: HistoricoRemesasChk[];
}

export interface HistoricoRemesasChk {
  id:                         string;
  empresaId:                  string;
  ordenanteId:                string;
  remesaId:                   string;
  estado:                     string;
  nombreEmision:              string;
  ordenanteNombre:            string;
  ordenanteNif:               string;
  ordenanteCuenta:            string;
  ordenanteAliasCuenta:       string;
  nombreRemesa:               string;
  numDocumentos:              number;
  importe:                    number;
  fechaAbono:                 Date;
  numeroRemesa:               number;
  error:                      boolean;
  mensajeError:               string;
  fechaInicioEmision:         Date;
  fechaFinGeneracionFicheros: Date;
  fechaConfirmacion:          Date;
  historicosCheque:           HistoricosCheque[];
}

export interface HistoricosCheque {
  id:                 string;
  historicoRemesaId:  string;
  chequeId:           string;
  importe:            number;
  tipoCheque:         string;
  numeroCheque:       string;
  fechaVencimiento:   Date;
  libradorId:         string;
  libradorNombre:     string;
  libradorReferencia: string;
  libradorCuenta:     string;
}

export interface Libradore {
  id:          string;
  ordenanteId: string;
  nombre:      string;
  referencia:  string;
  cuenta:      string;
}

export interface RemesasChk {
  id:          string;
  ordenanteId: string;
  nombre:      string;
  cheques:     Cheque[];
}

export interface Cheque {
  id:               string;
  libradorId:       string;
  remesaId:         string;
  importe:          number;
  numeroCheque:     string;
  tipoCheque:       string;
  fechaVencimiento: Date;
}

export interface Sct {
  ordenantes: SctOrdenante[];
}

export interface SctOrdenante {
  id:                    string;
  empresaId:             string;
  nombre:                string;
  nif:                   string;
  sufijo:                string;
  dirTipoVia:            string;
  dirNombreVia:          string;
  dirNumeroEdificio:     string;
  dirRestoDireccion:     string;
  dirCodigoPostal:       string;
  dirLocalidad:          string;
  dirProvincia:          string;
  dirIsoPais:            string;
  cuenta:                string;
  aliasCuenta:           string;
  existeCuentaEnEntidad: boolean;
  beneficiarios:         Beneficiario[];
  remesasSct:            RemesasSct[];
  historicosRemesasSct:  HistoricosRemesasSct[];
}

export interface Beneficiario {
  id:          string;
  ordenanteId: string;
  nombre:      string;
  cuenta:      string;
  sepa:        boolean;
  bic:         string;
}

export interface HistoricosRemesasSct {
  id:                         string;
  empresaId:                  string;
  ordenanteId:                string;
  remesaId:                   string;
  estado:                     string;
  nombreEmision:              string;
  fechaAbono:                 Date;
  fechaVencimiento:           Date;
  financiar:                  boolean;
  presentadorNombre:          string;
  presentadorNif:             string;
  presentadorSufijo:          string;
  nombreRemesa:               string;
  numDocumentos:              number;
  importe:                    number;
  identificadorMensaje:       string;
  error:                      boolean;
  mensajeError:               string;
  fechaInicioEmision:         Date;
  fechaFinGeneracionFicheros: Date;
  fechaConfirmacion:          Date;
  historicosTransferenciaSct: HistoricosTransferenciaSct[];
}

export interface HistoricosTransferenciaSct {
  id:                           string;
  historicoRemesaId:            string;
  transferenciaId:              string;
  concepto:                     string;
  importe:                      number;
  categoriaProposito:           string;
  fechaAbono:                   Date;
  identificadorExtremoAExtremo: string;
  nombreUltimoOrdenante:        string;
  ordenanteNombre:              string;
  ordenanteNif:                 string;
  ordenanteSufijo:              string;
  ordenanteCuenta:              string;
  ordenanteDirTipoVia:          string;
  ordenanteDirNombreVia:        string;
  ordenanteDirNumeroEdificio:   string;
  ordenanteDirRestoDireccion:   string;
  ordenanteDirCodigoPostal:     string;
  ordenanteDirLocalidad:        string;
  ordenanteDirProvincia:        string;
  ordenanteDirIsoPais:          string;
  beneficiarioId:               string;
  beneficiarioNombre:           string;
  beneficiarioCuenta:           string;
  beneficiarioSepa:             boolean;
  beneficiarioBic:              string;
}

export interface RemesasSct {
  id:                string;
  ordenanteId:       string;
  nombre:            string;
  esPlantilla:       boolean;
  transferenciasSct: TransferenciasSct[];
}

export interface TransferenciasSct {
  id:                    string;
  beneficiarioId:        string;
  remesaId:              string;
  plantillaOrigenNombre: string;
  importe:               number;
  concepto:              string;
  categoriaProposito:    string;
  nombreUltimoOrdenante: string;
  activa:                boolean;
}

export interface Sdd {
  acreedores: Acreedores[];
}

export interface Acreedores {
  id:                string;
  empresaId:         string;
  nombre:            string;
  nif:               string;
  sufijo:            string;
  bloqueado:         boolean;
  dirTipoVia:        string;
  dirNombreVia:      string;
  dirNumeroEdificio: string;
  dirRestoDireccion: string;
  dirCodigoPostal:   string;
  dirLocalidad:      string;
  dirProvincia:      string;
  dirIsoPais:        string;
  cuenta:            string;
  modalidad:         string;
  tieneContrato:     boolean;
  remesasSdd:        RemesasSdd[];
  deudores:          Deudore[];
  historicoRemesas:  HistoricoRemesa[];
}

export interface Deudore {
  id:                string;
  acreedorId:        string;
  nombre:            string;
  nif:               string;
  cuenta:            string;
  referenciaMandato: string;
  fechaFirma:        Date;
  recurrente:        boolean;
  direccion:         string;
  isoPais:           string;
}

export interface HistoricoRemesa {
  id:                         string;
  empresaId:                  string;
  acreedorId:                 string;
  remesaId:                   string;
  estado:                     string;
  nombreEmision:              string;
  presentadorNombre:          string;
  presentadorNif:             string;
  presentadorSufijo:          string;
  acreedorNombre:             string;
  acreedorNif:                string;
  acreedorSufijo:             string;
  acreedorDirTipoVia:         string;
  acreedorDirNombreVia:       string;
  acreedorDirNumeroEdificio:  string;
  acreedorDirRestoDireccion:  string;
  acreedorDirCodigoPostal:    string;
  acreedorDirLocalidad:       string;
  acreedorDirProvincia:       string;
  acreedorDirIsoPais:         string;
  nombreRemesa:               string;
  numDocumentos:              number;
  importe:                    number;
  identificacionMensaje:      string;
  modalidad:                  string;
  error:                      boolean;
  mensajeError:               string;
  fechaInicioEmision:         Date;
  fechaFinGeneracionFicheros: Date;
  fechaConfirmacion:          Date;
  historicosRecibo:           HistoricosRecibo[];
}

export interface HistoricosRecibo {
  id:                      string;
  historicoRemesaId:       string;
  reciboId:                string;
  concepto:                string;
  importe:                 number;
  fechaCobro:              Date;
  referenciaAdeudo:        string;
  secuenciaAdeudo:         string;
  idInstruccion:           string;
  idBloque:                string;
  apunteUnico:             boolean;
  deudorId:                string;
  deudorNombre:            string;
  deudorCuenta:            string;
  deudorNif:               string;
  deudorRecurrente:        boolean;
  deudorReferenciaMandato: string;
  deudorFechaFirma:        Date;
  deudorDireccion:         string;
  deudorIsoPais:           string;
  nombreUltimoDeudor:      string;
}

export interface RemesasSdd {
  id:                string;
  acreedorId:        string;
  nombre:            string;
  esPlantilla:       boolean;
  fechaCreacion:     Date;
  fechaModificacion: Date;
  recibos:           Recibo[];
}

export interface Recibo {
  id:                    string;
  deudorId:              string;
  remesaId:              string;
  plantillaOrigen:       string;
  plantillaOrigenNombre: string;
  importe:               number;
  concepto:              string;
  fechaCobro:            Date;
  nombreUltimoDeudor:    string;
  activo:                boolean;
}



