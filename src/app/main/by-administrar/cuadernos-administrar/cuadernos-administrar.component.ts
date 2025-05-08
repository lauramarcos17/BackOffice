import { ClienteJsonInterface, SctOrdenante, ChkOrdenante, Acreedores } from './../../../shared/interfaces/ClienteJson.interface';
import { Component, computed, inject, signal } from '@angular/core';
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
import { MiSignalService } from '../../../shared/services/mi-signal.service';



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
 
];

@Component({
  selector: 'app-cuadernos-administrar',
  imports: [FormsModule, MatFormFieldModule,MatCardModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule,MatSelectModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDividerModule,  MatButton, MatButtonModule, MatTooltip, MatIconModule],
  templateUrl: './cuadernos-administrar.component.html',
  styleUrl: '../by-administrar.component.css'
})
export class CuadernosAdministrarComponent {
  
   misignalService=inject(MiSignalService);
  jsonDatoService = inject(JsonDatoService);
  tipoCuadernoSignal=signal('');


  displayedColumns: string[] = ['ordenantes', 'cuenta', 'nif', 'estado'];
  
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  textosGuiaFacil = new Map<string, string>([
    ['guia', 'Este menú permite administrar los datos de un cliente en AEBWeb, accediendo a todas las funciones disponibles en el front-end. Debe usarse con precaución ya que permite modificar y eliminar los datos introducidos por el cliente.\n Para acceder a AEBWeb con la cuenta de un cliente, elija un cuaderno, introduzca un identificador de usuario y pulse [Acceder].\n No se permite el acceso simultáneo del cliente cuando se está administrando su cuenta desde back-office.\n Si el cliente está conectado a AEBWeb, se interrumpirá su sesión. Si el cliente intenta acceder mientras se le está administrando se le redirigirá a una pantalla explicativa. No olvide salir de forma controlada de la sesión de administración. Para ello debe usar el botón "Salir" que verá en la parte superior de la pantalla. En otro caso el usuario no podrá acceder hasta que la sesión de administración caduque.\n Cada vez que acceda a administrar un usuario se le ofrecerá la posibilidad de crear una copia de seguridad completa de los datos del usuario. Esta copia le permitirá restaurar, en caso necesario, los datos originales del cliente tras la sesión de administración. Recuerde que sólo se mantiene una copia de seguridad por cliente. Si crea una nueva copia se machacará la existente.'],

  ]);

  // En by-administrar llamar al objeto y mirar que cuadernos tiene para luego rellenar el array de cuaderno.
  cuadernos: Cuaderno[] = [
    {value: 'sct', viewValue: 'Transferencias'},
    {value: 'sdd', viewValue: 'Adeudos'},
    {value: 'chk', viewValue: 'Cheques'},
  ];

    
    cargarTablaInicio(tipoCuaderno: string) {
      
      const cliente = this.misignalService.objetoCliente();
      console.log('hola'+cliente?.nombre);
      this.tipoCuadernoSignal.set(tipoCuaderno);

      //si lo dejo solo con ordenantes=[] error
      let ordenantes : (SctOrdenante | Acreedores | ChkOrdenante)[] = [];
      switch(tipoCuaderno){
        case 'sct':
          //cliente?.sct.ordenantes[0].nombre;
          //cliente?.sct.ordenantes[0].cuenta;
          //cliente?.sct.ordenantes[0].nif ;
          //cliente?.sct.ordenantes[0].sufijo;
          ordenantes=cliente?.sct.ordenantes ?? [];
          break;

          case 'sdd':
          ordenantes = cliente?.sdd?.acreedores ?? [];
            break;

          case 'chk':
          ordenantes = cliente?.chk?.ordenantes ?? [];
          break;
      }

      //mapeo los datos y convierto en formato
      const data: infoCuaderno[] = ordenantes.map((o: any) => ({
        ordenantes: o.nombre,
        cuenta: o.cuenta,
        nif:`${o.nif} ${o.sufijo? o.sufijo:''}`,
        estado: o.existeCuentaEnEntidad ? 'Activo' : 'Inactivo'

      }));

      this.dataSource.data = data;

      }

      isCuadernoAvailable(tipoCuaderno: string): boolean {
        const cliente = this.misignalService.objetoCliente();
        switch (tipoCuaderno) {
          case 'sct':
            return !!cliente?.sct?.ordenantes?.length;
          case 'sdd':
            return !!cliente?.sdd?.acreedores?.length;
          case 'chk':
            return !!cliente?.chk?.ordenantes?.length;
          default:
            return false;
        }
      }
    }
  





