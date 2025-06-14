import { Sdd, RemesasSct, RemesasSdd, RemesasChk } from './../../../shared/interfaces/ClienteJson.interface';
import { MiSignalService } from 'app/shared/services/mi-signal.service';
import { Component, computed, effect, inject, Inject, signal } from '@angular/core';
import { CuadernosAdministrarComponent } from 'app/main/by-administrar/cuadernos-administrar/cuadernos-administrar.component';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { CopiaSeguridadJson } from 'app/shared/interfaces/CopiaSeguridadJson.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Backup } from 'app/shared/interfaces/Backup.interface';
import { Log } from 'app/shared/interfaces/Log.interface';


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
  imports: [MatDividerModule, CuadernosAdministrarComponent,MatDialogModule, MatTabsModule, MatTableModule, MatTooltipModule, MatButtonModule],
  templateUrl: './tabla-totales.component.html',
  styleUrl: '../by-copias.component.css'
})
export class TablaTotalesComponent {
  misignalService=inject(MiSignalService);

  jsonDatoService = inject(JsonDatoService);

 mostrarTablaTotales = computed (()=> this.misignalService.mostrarTablaTotales());
  idCliente=computed(()=>this.misignalService.objetoCliente()!.id.toString());
  ordenanteSignal=computed(()=>this.misignalService.ordenanteSignal());
  deudoresSignal=computed(()=>this.misignalService.deudoresSignal());
  nombrerol=this.misignalService.nombrerol();
  clienteEncontradoDeMain=computed(()=>this.misignalService.clienteEncontradoDeMain());



  displayedColumns: string[] = ['acreedores', 'deudores', 'remesas', 'recibos','remesasemitidas','recibosemitidos'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  terminosTablas:string[]=['','','',]





constructor() {
  effect(() => {

   const ordenantes = this.ordenanteSignal();
   this.clienteEncontradoDeMain();


      const tipoCuaderno = this.misignalService.tipoCuadernoSignal(); // asegúrate de tener esta señal en tu servicio
      let acreedores = 0;
      let deudores = 0;
      let totalRemesas = 0;
      let totalRecibos = 0;
      let historicoRemesas =0;
      let historicoRecibos=0;
      let prueba="";

      if (tipoCuaderno === 'sct') {
        this.terminosTablas=['Ordenantes','Beneficiarios','Transferencias', 'Transferencias emitidas'];
        this.misignalService.cuadernoSeleccionado.set(true);
        acreedores = ordenantes.length;
        deudores = ordenantes.reduce((acc, ord: any) => acc + (ord.beneficiarios?.length ?? 0), 0);
        totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasSct?.length ?? 0), 0);
        totalRecibos = ordenantes.reduce((acc, ord: any) => {
          const remesas = ord.remesasSct ?? [];
          // Suma la cantidad de transf en cada remesa
          return acc + remesas.reduce((accRem: number, rem: any) => accRem + (rem.transferenciasSct?.length ?? 0), 0);
        }, 0);
        historicoRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.historicosRemesasSct?.length ?? 0), 0);
        historicoRecibos = ordenantes.reduce((acc, ord: any) => {
          const remesas = ord.historicosRemesasSct ?? [];
          // Suma la cantidad de transf en cada remesa
          return acc + remesas.reduce((accRem: number, rem: any) => accRem + (rem.historicosTransferenciaSct?.length ?? 0), 0);
        }, 0);

      } else if (tipoCuaderno === 'sdd') {
        this.terminosTablas=['Acreedores','Deudores','Recibos', 'Recibos emitidos'];
        this.misignalService.cuadernoSeleccionado.set(true);
        acreedores = ordenantes.length;
        deudores = ordenantes.reduce((acc, ord: any) => acc + (ord.deudores?.length ?? 0), 0);
        totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasSdd?.length ?? 0), 0);
        totalRecibos = ordenantes.reduce((acc, ord: any) => {
          const remesas = ord.remesasSdd ?? [];
          // Suma la cantidad de recibos en cada remesa
          return acc + remesas.reduce((accRem: number, rem: any) => accRem + (rem.recibos?.length ?? 0), 0);
        }, 0);
        historicoRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.historicoRemesas?.length ?? 0), 0);
        historicoRecibos = ordenantes.reduce((acc, ord: any) => {
          const remesas = ord.historicoRemesas ?? [];
          // Suma la cantidad de transf en cada remesa
          return acc + remesas.reduce((accRem: number, rem: any) => accRem + (rem.historicosRecibo?.length ?? 0), 0);
        }, 0);

      } else if (tipoCuaderno === 'chk') {
      this.misignalService.cuadernoSeleccionado.set(true);
      this.terminosTablas=['Ordenantes','Libradores','Cheques', 'Cheques emitidos'];
        acreedores = ordenantes.length;
        deudores = ordenantes.reduce((acc, ord: any) => acc + (ord.libradores?.length ?? 0), 0);
        totalRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.remesasChk?.length ?? 0), 0);
        totalRecibos = ordenantes.reduce((acc, ord: any) => {
          const remesas = ord.remesasChk ?? [];
          // Suma la cantidad de cheques en cada remesa
          return acc + remesas.reduce((accRem: number, rem: any) => accRem + (rem.cheques?.length ?? 0), 0);
        }, 0);
        historicoRemesas = ordenantes.reduce((acc, ord: any) => acc + (ord.historicoRemesasChk?.length ?? 0), 0);
        historicoRecibos = ordenantes.reduce((acc, ord: any) => {
          const remesas = ord.historicoRemesasChk ?? [];
          // Suma la cantidad de transf en cada remesa
          return acc + remesas.reduce((accRem: number, rem: any) => accRem + (rem.historicosCheque?.length ?? 0), 0);
        }, 0);
      }else {
        this.misignalService.cuadernoSeleccionado.set(false);
      }




      const data: infoTotal[] = [{
      acreedores: acreedores.toString(),
      deudores: deudores.toString(),
      remesas: totalRemesas.toString(),
      recibos: totalRecibos.toString(),
      remesasemitidas: historicoRemesas.toString(),
      recibosemitidos: historicoRecibos.toString(),
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

    //controlamos lo que recogemos por teclado
    let descripcionCopia=prompt("Introduce una descripción para la copia de seguridad")
      if (descripcionCopia === null) { //cuando el usuario pulsa cancelar
      return;

    } else {
      if (descripcionCopia.trim() === "") { //cuando el usuario no pone nada y da aceptar
      descripcionCopia="Copia de seguridad generada correctamente.";
       }
      this.jsonDatoService.crearCopiaSeguridad(this.idCliente(),descripcionCopia).subscribe((resp: CopiaSeguridadJson) => {
          console.log(resp),
          this.misignalService.copiaSeguridad.set(resp);

         

          //Al crear una copia cambio la señal para que se ejecute el efecto
          this.misignalService.actualizarBackup.set(true);
          this.mandaLogBruto(resp);


      });
        //ponemos tiempo para cambiar a la otra pestaña porque si no no actualiza al momento las copias
        setTimeout(() => {
        this.misignalService.mostrarTablaTotales.set(false);
      }, 400);
        console.log(this.misignalService.mostrarTablaTotales());
    }

   }
    mandaLogBruto(row : CopiaSeguridadJson){ //TIENE QUE RECIBIR UN LOG QUE SE GENERE EN CADA ACCIÓN
      
            const logBruto= {
                    id:0,
                    fechaInicio: row.fechaHora,
                    fechaFin: this.addHoursToISOString(row.fechaHora),
                    usuario: this.misignalService.mensaje().toString(),
                    rol:this.nombrerol,
                    cuaderno: this.misignalService.tipoCuadernoSignal(),
                    operacion: 'Copia de seguridad creada',
                    descripcion: row.descripcion,
                    cliente: this.misignalService.objetoCliente()!.id.toString()
                  };
         console.log(logBruto);
           this.jsonDatoService.crearLog(logBruto).subscribe((resp: Log) => {
                  console.log(resp);
        },
     )}

    addHoursToISOString(dateStr: string): string {
      const [datePart, timePart] = dateStr.split(" - ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);

      // Crear la fecha en UTC (mes en JavaScript va de 0 a 11)
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
      date.setUTCHours(date.getUTCHours() + 1);

      // Formatear a dd/MM/yyyy - HH:mm:ss
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedDate = `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} - ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
      return formattedDate;
    }




 }
