import { ConsultasLogsComponent } from './consultas-logs/consultas-logs.component';
import {  Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';



interface Food {
  value: string;
  viewValue: string;
}


@Component({

  selector: 'app-by-logs',
  imports: [ConsultasLogsComponent,FormsModule,MatSelectModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDividerModule,  MatButton, MatButtonModule, MatTooltip, MatIconModule],
  templateUrl: './by-logs.component.html',
  styleUrl: 'by-logs.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ByLogsComponent {

  private _snackBar = inject(MatSnackBar);

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];


  textosGuiaFacil = new Map<string, string>([
    ['guia',' Este menú permite ver las operaciones de base de datos realizadas sobre los datos de un cliente en los cuadernos SEPA de AEBWeb. El periodo para el que se mantiene este log de acciones está fijado en la configuración de la aplicación.'],
    ['verdias','Elija un cuaderno de los existentes en la lista, introduzca un identificador de usuario y pulse [Ver días con actividad]. Se mostrarán los días en los que ese usuario tuvo actividad en la norma elegida.'],
    ['cargar','Seleccione una fecha y pulse [Cargar log] para mostrar el listado con las operaciones realizadas en esa fecha, sobre los datos del cliente elegido, en la norma seleccionada.'],
    ['query', 'Para facilitar la localización de las operaciones que modifican los datos en base de datos, puede marcar el check Mostrar sólo querys que alteren base de datos. Se mostrarán sólo las queries de inserción, actualización y borrado de datos.'],
    ['buscar', 'Puede hacer uso del campo de búsqueda de texto libre, sobre la tabla, para buscar en las columnas"Acción" y "Query"'],
    ['rol','El campo "Rol" permite distinguir si la acción la ha realizado el cliente ("Estandar") o se ha realizado desde Back-office como "Administrador" o "Supervisor".' ],
    ['accion','El campo "Acción" indica la acción del usuario que desencadenó esa operación de base de datos. \n Seleccione la fila correspondiente a una acción para ver la consulta completa en el cuadro bajo la tabla.']
  ]);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar() {
    this._snackBar.open(this.textosGuiaFacil.get("guia")!, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration:5000,
      panelClass: ['snackbar-pre']
    });
  }

 }


