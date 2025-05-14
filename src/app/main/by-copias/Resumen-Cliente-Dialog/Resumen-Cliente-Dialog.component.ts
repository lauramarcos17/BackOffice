import { Component, inject, Inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA,  MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CuadernosAdministrarComponent } from "../../by-administrar/cuadernos-administrar/cuadernos-administrar.component";
import { MiSignalService } from 'app/shared/services/mi-signal.service';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { ClienteJsonInterface } from 'app/shared/interfaces/ClienteJson.interface';
import { CopiaSeguridadJson } from 'app/shared/interfaces/CopiaSeguridadJson.interface';



@Component({
  selector: 'app-resumen-cliente-dialog',
  imports: [MatDialogModule, MatTabsModule, MatTableModule, MatTooltipModule, MatButtonModule, CuadernosAdministrarComponent],
  templateUrl: './Resumen-Cliente-Dialog.component.html',
  styleUrls: ['./Resumen-Cliente-Dialog.component.css'],
})
export class ResumenClienteDialogComponent {
  jsonDatoService = inject(JsonDatoService);
  misignalService=inject(MiSignalService);

 idCliente=this.misignalService.objetoCliente()!.id.toString();



  textosGuiaFacil = new Map<string, string>([
    ['volver', 'Cerrará la ventana de creación de copias de seguridad y volverá a la pantalla de administración. Si desea crear una copia de seguridad, pulse el botón "Crear copia de seguridad"'],
    ['crearcopia','Creará una copia de seguridad de los datos del cliente.'],
  ]);

  crearCopiaSeguridad(){

    // this.jsonDatoService.crearCopiaSeguridad(this.idCliente).subscribe((resp:ClienteJsonInterface)=>
    //         {console.log(resp),
    //           this.jsonDatoService.guardarCopiaSeguridad(resp);


    //           this.misignalService.objetoCliente.set(resp);//enviamos el objeto obtenido del json a la señal
    //         });

      this.jsonDatoService.crearCopiaSeguridad(this.idCliente).subscribe((resp: CopiaSeguridadJson) => {
        console.log(resp),
        this.misignalService.copiaSeguridad.set(resp);

        alert("Esto es el objeto resp --> "+ JSON.stringify(resp, null, 2));
    // Creamos el objeto de copia de seguridad
        // const copia: CopiaSeguridadJson = {
        //   idCliente: resp.idCliente,
        //   fecha: new Date(), // formato yyyy-MM-dd
        //   descripcion: "Copia creada desde Angular" //***** */
        // };

  //    Guardamos la copia en el backend EL BUENO
        // this.jsonDatoService.guardarCopiaSeguridad(resp).subscribe({
        //   next: () => console.log("Copia guardada correctamente"),
        //   error: err => console.error("Error al guardar la copia", err)
        // });
        // this.jsonDatoService.guardarCopiaSeguridad(resp).subscribe({
        //   next: () => console.log("Copia guardada correctamente"),
        //   error: err => console.error("Error al guardar la copia", err),

        // })

  //   // Actualizamos el cliente en la señal
  //   this.misignalService.objetoCliente.set(resp);
   });

   }
  //PENDIENTE PROBAR***


}
