import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class MiSignalService {
  // Signal compartida
  mensaje = signal<string >('');
  nombrerol=signal<string>('');
  rol=signal<number>(0);

  setMensaje(nuevo: string ) {
    this.mensaje.set(nuevo);
  }

  setNombrerol(nuevo:string ){
    this.nombrerol.set(nuevo);
  }

  setNumRol(nuevo:number ){
    this.rol.set(nuevo);
  }


}