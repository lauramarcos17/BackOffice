import { Injectable, signal } from '@angular/core';
import { ClienteJsonInterface } from '../interfaces/ClienteJson.interface';
import { CopiaSeguridadJson } from '../interfaces/CopiaSeguridadJson.interface';


@Injectable({ providedIn: 'root' })

export class MiSignalService {
  // Signal compartida
  mensaje = signal<string >('');
  nombrerol=signal<string>('');
  rol=signal<number>(0);
  primeraBusqueda = signal<boolean>(false);
  objetoCliente = signal<ClienteJsonInterface|null>(null);
  clienteElegido =  signal(false);
  copiaSeguridad = signal<CopiaSeguridadJson|null>(null);

  clienteEncontradoDeMain = signal<boolean>(false);
  tipoError = signal<string>("");



  setMensaje(nuevo: string ) {
    this.mensaje.set(nuevo);
  }

  setNombrerol(nuevo:string ){
    this.nombrerol.set(nuevo);
  }

  setNumRol(nuevo:number ){
    this.rol.set(nuevo);
  }

  setPrimeraBusqueda(nuevo: boolean){
    this.primeraBusqueda.set(nuevo);
  }

  setObjetoCliente(nuevo: ClienteJsonInterface){
    this.objetoCliente.set(nuevo);
  }
  setClienteElegido(nuevo: boolean){
    this.clienteElegido.set(nuevo);
  }

  setClienteEncontradoDeMain(nuevo: boolean){
    this.clienteEncontradoDeMain.set(nuevo);
  }

  setTipoError(nuevo: string ) {
    this.tipoError.set(nuevo);
  }


}
