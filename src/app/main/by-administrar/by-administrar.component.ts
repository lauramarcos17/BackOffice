import { ClienteJsonInterface } from './../../shared/interfaces/ClienteJson.interface';
import { CuadernosAdministrarComponent } from './cuadernos-administrar/cuadernos-administrar.component';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { JsonDatoService } from '../../shared/services/jsonDato.service';
import { MiSignalService } from '../../shared/services/mi-signal.service';








@Component({
  selector: 'app-by-administrar',
  imports: [CuadernosAdministrarComponent,FormsModule, MatFormFieldModule,MatCardModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule,MatSelectModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDividerModule,  MatButton, MatButtonModule, MatTooltip, MatIconModule],
  templateUrl: './by-administrar.component.html',
  styleUrl: 'by-administrar.component.css',
})
export class ByAdministrarComponent {
  misignalService=inject(MiSignalService);


  jsonDatoService = inject(JsonDatoService);

  clienteEncontradoDeMain = computed(()=>this.misignalService.clienteEncontradoDeMain());
  tipoError = computed(()=> this.misignalService.tipoError());




  textosGuiaFacil = new Map<string, string>([
    ['guia', 'Este menú permite administrar los datos de un cliente en AEBWeb, accediendo a todas las funciones disponibles en el front-end. Debe usarse con precaución ya que permite modificar y eliminar los datos introducidos por el cliente.\n Para acceder a AEBWeb con la cuenta de un cliente, introduzca un identificador de usuario y pulse el botón, posteriormente elija un cuaderno.\n No se permite el acceso simultáneo del cliente cuando se está administrando su cuenta desde back-office.\n Si el cliente está conectado a AEBWeb, se interrumpirá su sesión. Si el cliente intenta acceder mientras se le está administrando se le redirigirá a una pantalla explicativa. No olvide salir de forma controlada de la sesión de administración. Para ello debe usar el botón "Salir" que verá en la parte superior de la pantalla. En otro caso el usuario no podrá acceder hasta que la sesión de administración caduque.\n Cada vez que acceda a administrar un usuario se le ofrecerá la posibilidad de crear una copia de seguridad completa de los datos del usuario. Esta copia le permitirá restaurar, en caso necesario, los datos originales del cliente tras la sesión de administración. Recuerde que sólo se mantiene una copia de seguridad por cliente. Si crea una nueva copia se machacará la existente.'],
    ['Buscar','Introduzca un identificador de usuario y pulse el botón para que se muestren los cuadernos']
  ]);








}
