import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MiSignalService } from '../../shared/services/mi-signal.service';




export interface Log{
  error:number;
  fecha: Date;
  rol:number;
  cuaderno: string;
  accion: string;
  query: string;
}
const ELEMENT_DATA: Log[] = [
  {error: 1, fecha: new Date(1991, 10, 30), rol:3,cuaderno :'34SEPA',accion:'Listar ordenantes', query: 'update 34293'},
  {error: 2, fecha: new Date(1991, 10, 30), rol:2,cuaderno :'34SEPA',accion:'Listar ordenantes', query: 'update 976693'},
  {error: 3, fecha: new Date(1998, 10, 30), rol:1,cuaderno :'34SEPA',accion:'Listar ordenantes', query: 'update 98293'},

];


@Component({
  selector: 'app-by-historico',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './by-historico.component.html',
  styleUrl: 'by-historico.component.css',

})
export class ByHistoricoComponent {
  private _snackBar = inject(MatSnackBar);
  misignalService=inject(MiSignalService);
  displayedColumns: string[] = ['error', 'fecha', 'rol','cuaderno','accion','query'];
  dataSource = ELEMENT_DATA;


  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  textosGuiaFacil = new Map<string, string>([
    ['guia', 'Este menú permite gestionar y seleccionar las migraciones que se hayan realizado. \n- La selección de los resultados de las migraciones se puede realizar de forma individual haciendo click sobre la tabla o haciendo uso del botón [Seleccionar todo]. Cumple una doble función: \n 1. Selecciona todo si no hay registros seleccionados. \n 2. Deselecciona todo si hay registros seleccionados. \n Se mostrarán una serie de notificaciones que informarán sobre el resultado de la operación. \n Los botones [Limpiar operaciones] y [Exportar operaciones] se habilitan al seleccionar al menos un registro de la tabla.El botón [Restaurar migraciones], se habilita cuando al menos un registro de la tabla es seleccionado ycorresponde a una migración con resultado Realizada o En curso.... \n Las acciones que se pueden realizar sobre las migraciones seleccionadas son: \n[Limpiar operaciones], esta acción no se puede deshacer. Permite eliminar elementos de la tabla demigraciones. Cuando el elemento eliminado es una migración se elimina la copia de seguridad de losusuarios que se generaron en la migración.\n [Restaurar migraciones], esta acción no se puede deshacer. Vuelve al estado previo de las migracionesseleccionadas, recuperando la información de las copias de seguridad. Si el usuario Origen o Destinohubiesen añadido información tras la migración, esta se perderá. La migración restaurada no se elimina. Esto permite restaurarla de nuevo si fuera necesario.[Exportar operaciones], genera un fichero excel con el resultado de las operaciones seleccionadas.'],
    ['seleccionar', 'La selección de los resultados de las migraciones se puede realizar de forma individual haciendo click sobre la tabla o haciendo uso del botón, cumple una doble función: Selecciona todo si no hay registros seleccionados.\n Deselecciona todo si hay registros seleccionados.\n Se mostrarán una serie de notificaciones que informarán sobre el resultado de la operación.'],
    ['limpiar','Esta acción no se puede deshacer. Permite eliminar elementos de la tabla demigraciones. Cuando el elemento eliminado es una migración se elimina la copia de seguridad de losusuarios que se generaron en la migración.'],
    ['restaurar','Esta acción no se puede deshacer. Vuelve al estado previo de las migraciones seleccionadas, recuperando la información de las copias de seguridad. Si el usuario Origen o Destino hubiesen añadido información tras la migración, esta se perderá. La migración restaurada no se elimina. Esto permite restaurarla de nuevo si fuera necesario.'],
    ['exportar','Genera un fichero excel con el resultado de las operaciones seleccionadas.'],

  ]);

  openSnackBar() {
    this._snackBar.open(this.textosGuiaFacil.get("guia")!, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration:1000000,
      panelClass: ['snackbar-pre']
    });
  }
}



