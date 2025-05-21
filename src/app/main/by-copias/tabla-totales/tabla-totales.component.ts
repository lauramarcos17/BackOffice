import { Sdd, RemesasSct, RemesasSdd, RemesasChk } from './../../../shared/interfaces/ClienteJson.interface';
import { MiSignalService } from 'app/shared/services/mi-signal.service';
import { Component, computed, effect, inject, Inject } from '@angular/core';
import { CuadernosAdministrarComponent } from 'app/main/by-administrar/cuadernos-administrar/cuadernos-administrar.component';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { CopiaSeguridadJson } from 'app/shared/interfaces/CopiaSeguridadJson.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';


export interface infoTotal {
  acreedores:string;
  deudores: string;
  remesas: string;
  recibos:string;
  remesasemitidas:string;
  recibosemitidos:string;
}
const ELEMENT_DATA: infoTotal[] = [

];

@Component({
  selector: 'app-tabla-totales',
  imports: [CuadernosAdministrarComponent,MatDialogModule, MatTabsModule, MatTableModule, MatTooltipModule, MatButtonModule],
  templateUrl: './tabla-totales.component.html',
})
export class TablaTotalesComponent {
  misignalService=inject(MiSignalService);

  jsonDatoService = inject(JsonDatoService);
  
 mostrarTablaTotales = computed (()=> this.misignalService.mostrarTablaTotales());
  idCliente=computed(()=>this.misignalService.objetoCliente()!.id.toString());
  ordenanteSignal=computed(()=>this.misignalService.ordenanteSignal());
  deudoresSignal=computed(()=>this.misignalService.deudoresSignal());


  displayedColumns: string[] = ['acreedores', 'deudores', 'remesas', 'recibos','remesasemitidas','recibosemitidos'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  

constructor() {
  effect(() => {

   const ordenantes = this.ordenanteSignal();


      const tipoCuaderno = this.misignalService.tipoCuadernoSignal(); // asegúrate de tener esta señal en tu servicio
      let acreedores = 0;
      let deudores = 0;
      let totalRemesas = 0;
      let prueba="";

      if (tipoCuaderno === 'sct') {
        acreedores = ordenantes.length;
        deudores = ordenantes.reduce((acc, ord: any) => acc + (ord.beneficiarios?.length ?? 0), 0);
        totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasSct?.length ?? 0), 0);
        prueba='sc'
      } else if (tipoCuaderno === 'sdd') {
        acreedores = ordenantes.length;
        deudores = ordenantes.reduce((acc, ord: any) => acc + (ord.deudores?.length ?? 0), 0);
        totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasSdd?.length ?? 0), 0);
        prueba='sd'
      } else if (tipoCuaderno === 'chk') {
        acreedores = ordenantes.length;
        deudores = ordenantes.reduce((acc, ord: any) => acc + (ord.libradores?.length ?? 0), 0);
        totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasChk?.length ?? 0), 0);
      }




   /*
    //cuento total de beneficiarios/libradores/deudores un cuaderno elegido de un cliente 
     let total = 0;
  if (ordenantes.length && 'beneficiarios' in ordenantes[0]) {
    total = ordenantes.reduce((acc, ord: any) => acc + (ord.beneficiarios?.length ?? 0), 0);
  } else if (ordenantes.length && 'deudores' in ordenantes[0]) {
    total = ordenantes.reduce((acc, ord: any) => acc + (ord.deudores?.length ?? 0), 0);
  } else if (ordenantes.length && 'libradores' in ordenantes[0]) {
    total = ordenantes.reduce((acc, ord: any) => acc + (ord.libradores?.length ?? 0), 0);
  }

  
    //cuento total de beneficiarios/libradores/deudores un cuaderno elegido de un cliente 
     let totalRemesas = 0;
  if (ordenantes.length && 'remesasSct' in ordenantes[0]) {
    totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasSct?.length ?? 0), 0);
  } else if (ordenantes.length && 'remesasSdd' in ordenantes[0]) {
    totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasSdd?.length ?? 0), 0);
  } else if (ordenantes.length && 'remesasChk' in ordenantes[0]) {
    totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasChk?.length ?? 0), 0);
  }
*/
      const data: infoTotal[] = [{
      acreedores: acreedores.toString(),
      deudores: deudores.toString(),
      remesas: totalRemesas.toString(),
      recibos: prueba,
      remesasemitidas: '0',
      recibosemitidos: '0'
    }];
    this.dataSource.data = data;
  });
}

  textosGuiaFacil = new Map<string, string>([
    ['volver', 'Cerrará la ventana de creación de copias de seguridad y volverá a la pantalla de administración. Si desea crear una copia de seguridad, pulse el botón "Crear copia de seguridad"'],
    ['crearcopia','Creará una copia de seguridad de los datos del cliente.'],
  ]);

  volverSinCopia(){
    this.misignalService.mostrarTablaTotales.set(false);
  }

  crearCopiaSeguridad(){

   this.jsonDatoService.crearCopiaSeguridad(this.idCliente()).subscribe((resp: CopiaSeguridadJson) => {
        console.log(resp),
        this.misignalService.copiaSeguridad.set(resp);

        alert("Esto es el objeto resp --> "+ JSON.stringify(resp, null, 2));
      
    });
      this.misignalService.mostrarTablaTotales.set(false);
      console.log(this.misignalService.mostrarTablaTotales());


   }


   

 }
