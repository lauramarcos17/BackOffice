import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';
import { JsonDatoService } from '../../../shared/services/jsonDato.service';



interface Cuaderno {
  value: string;
  viewValue: string;
}

export interface infoCuaderno {
  ordenantes:string;
  cuenta: string;
  nif: string;
  estado:string;
}
const ELEMENT_DATA: infoCuaderno[] = [
  { ordenantes:'1',cuenta:'123455', nif:'07829',  estado: 'Activo'},


];

@Component({
  selector: 'app-cuadernos-administrar',
  imports: [FormsModule, MatFormFieldModule,MatCardModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule,MatSelectModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDividerModule,  MatButton, MatButtonModule, MatTooltip, MatIconModule],
  templateUrl: './cuadernos-administrar.component.html',
  styleUrl: '../by-administrar.component.css'
})
export class CuadernosAdministrarComponent {

  jsonDatoService = inject(JsonDatoService);


  displayedColumns: string[] = ['ordenantes', 'cuenta', 'nif', 'estado'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  textosGuiaFacil = new Map<string, string>([
    ['guia', 'Este menú permite administrar los datos de un cliente en AEBWeb, accediendo a todas las funciones disponibles en el front-end. Debe usarse con precaución ya que permite modificar y eliminar los datos introducidos por el cliente.\n Para acceder a AEBWeb con la cuenta de un cliente, elija un cuaderno, introduzca un identificador de usuario y pulse [Acceder].\n No se permite el acceso simultáneo del cliente cuando se está administrando su cuenta desde back-office.\n Si el cliente está conectado a AEBWeb, se interrumpirá su sesión. Si el cliente intenta acceder mientras se le está administrando se le redirigirá a una pantalla explicativa. No olvide salir de forma controlada de la sesión de administración. Para ello debe usar el botón "Salir" que verá en la parte superior de la pantalla. En otro caso el usuario no podrá acceder hasta que la sesión de administración caduque.\n Cada vez que acceda a administrar un usuario se le ofrecerá la posibilidad de crear una copia de seguridad completa de los datos del usuario. Esta copia le permitirá restaurar, en caso necesario, los datos originales del cliente tras la sesión de administración. Recuerde que sólo se mantiene una copia de seguridad por cliente. Si crea una nueva copia se machacará la existente.'],

  ]);


  cuadernos: Cuaderno[] = [
    {value: 'sct', viewValue: 'Transferencias'},
    {value: 'sdd', viewValue: 'Adeudos'},
    {value: 'chk', viewValue: 'Cheques'},
  ];

  busqueda(usuario:string, tipoCuaderno:string){
    console.log(tipoCuaderno);
    this.jsonDatoService.buscarPorCliente(usuario).subscribe((resp)=>console.log(resp));
  }


  }





