import { ClienteJsonInterface, SctOrdenante, ChkOrdenante, Acreedores, Libradore, Beneficiario, Deudore } from './../../../shared/interfaces/ClienteJson.interface';
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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { MiSignalService } from 'app/shared/services/mi-signal.service';



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
  private _snackBar = inject(MatSnackBar);

  tipoCuadernoSignal=signal('');
  nombreCliente = computed(() => this.misignalService.objetoCliente()?.nombre || '');
  nifCliente = computed(() => this.misignalService.objetoCliente()?.nif || '');
  dirCliente1 = computed(() => this.misignalService.objetoCliente()?.dirTipoVia || '');
  dirCliente2 = computed(() => this.misignalService.objetoCliente()?.dirNumeroEdificio || '');
  dirCliente3 = computed(() => this.misignalService.objetoCliente()?.dirRestoDireccion || '');
  dirCliente4 = computed(() => this.misignalService.objetoCliente()?.dirCodigoPostal || '');
  dirCliente5 = computed(() => this.misignalService.objetoCliente()?.dirLocalidad || '');
  dirCliente6 = computed(() => this.misignalService.objetoCliente()?.dirProvincia || '');
  dirCliente7 = computed(() => this.misignalService.objetoCliente()?.dirIsoPais || '');
  sufijoCliente = computed(() => this.misignalService.objetoCliente()?.sufijo || '');
  

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
      this.misignalService.tipoCuadernoSignal.set(tipoCuaderno);

      //si lo dejo solo con ordenantes=[] error
      let ordenantes : (SctOrdenante | Acreedores | ChkOrdenante)[] = [];
      let deudores: (Beneficiario|Deudore | Libradore)[] |undefined = [];
      switch(tipoCuaderno){
        case 'sct':
          ordenantes=cliente?.sct.ordenantes ?? [];
           deudores = cliente?.sct.ordenantes.flatMap(ord => ord.beneficiarios ?? []);
          break;

          case 'sdd':
          ordenantes = cliente?.sdd?.acreedores ?? [];
           deudores = cliente?.sdd.acreedores.flatMap(ord => ord.deudores ?? []);
        
            break;

          case 'chk':
          ordenantes = cliente?.chk?.ordenantes ?? [];
          deudores = cliente?.chk.ordenantes.flatMap(ord => ord.libradores ?? []);
          break;
      }

      //envio los datos del objeto cliente a la señal para recuperarlo en posteriores pestañas
     
       this.misignalService.ordenanteSignal.set(ordenantes);
        //this.misignalService.deudoresSignal.set(deudores ?? []);
      //mapeo los datos y convierto en formato
      const data: infoCuaderno[] = ordenantes.map((o: any) => ({
        ordenantes: o.nombre,
        cuenta: o.cuenta,
        nif:`${o.nif} ${o.sufijo? o.sufijo:''}`,
        estado: 'Inactivo' //lo dejamos como inactivo por defecto

      }));

      //Vinculamos con html
      this.dataSource.data = data;

      }

      //Intento de mostrar en el input solo los cuadernos existentes
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






