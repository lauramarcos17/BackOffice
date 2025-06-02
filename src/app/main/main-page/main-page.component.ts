import { MiSignalService } from './../../shared/services/mi-signal.service';
import { mainroutes } from './../main.routes';
import { ChangeDetectionStrategy, Component, computed, inject, input, Input, signal, ViewEncapsulation } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ByAdministrarComponent } from '../by-administrar/by-administrar.component';
import { ByCopiasComponent } from "../by-copias/by-copias.component";
import { ByMigrarComponent } from '../by-migrar/by-migrar.component';
import { ByLogsComponent } from '../by-logs/by-logs.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { JsonDatoService } from '../../shared/services/jsonDato.service';
import { ClienteJsonInterface } from 'app/shared/interfaces/ClienteJson.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main-page',
  imports: [MatTooltip,MatTooltipModule, MatInputModule, MatFormFieldModule, MatTabsModule,MatCardModule,MatIconModule, MatButtonModule,RouterOutlet, RouterLink, ByAdministrarComponent, ByCopiasComponent,ByMigrarComponent,ByLogsComponent],
  templateUrl: './main-page.component.html',
  styleUrl:'main-page.component.css',


})
export class MainPageComponent {
  router = inject(Router);
  misignalService=inject(MiSignalService);
  jsonDatoService=inject(JsonDatoService);
  mensaje= this.misignalService.mensaje;
  rolNombre=this.misignalService.nombrerol;
  rol=this.misignalService.rol;

  clienteEncontradoDesdeMain = computed(()=> this.misignalService.clienteEncontradoDeMain());

  selectedTab = this.misignalService.selectedTab;//declaro señal para que me mande a la pestaña de inicio si cambio el cliente


  textosGuiaFacil = new Map<string, string>([
    ['guia', 'Este menú permite administrar los datos de un cliente en AEBWeb, accediendo a todas las funciones disponibles en el front-end. Debe usarse con precaución ya que permite modificar y eliminar los datos introducidos por el cliente.\n Para acceder a AEBWeb con la cuenta de un cliente, introduzca un identificador de usuario y pulse el botón, posteriormente elija un cuaderno.\n No se permite el acceso simultáneo del cliente cuando se está administrando su cuenta desde back-office.\n Si el cliente está conectado a AEBWeb, se interrumpirá su sesión. Si el cliente intenta acceder mientras se le está administrando se le redirigirá a una pantalla explicativa. No olvide salir de forma controlada de la sesión de administración. Para ello debe usar el botón "Salir" que verá en la parte superior de la pantalla. En otro caso el usuario no podrá acceder hasta que la sesión de administración caduque.\n Cada vez que acceda a administrar un usuario se le ofrecerá la posibilidad de crear una copia de seguridad completa de los datos del usuario. Esta copia le permitirá restaurar, en caso necesario, los datos originales del cliente tras la sesión de administración. Recuerde que sólo se mantiene una copia de seguridad por cliente. Si crea una nueva copia se machacará la existente.'],
    ['Buscar','Introduzca un identificador de usuario y pulse el botón para que se muestren los cuadernos'],
    
  ]);

  controlPestana(event: number) {
    this.selectedTab.set(event); //redirige a la primera pestaña
    this.misignalService.mostrarTablaTotales.set(false);
    this.misignalService.cuadernoSeleccionado.set(false);
    this.misignalService.tipoCuadernoSignal.set('');
    this.misignalService.filaSeleccionada.set(0);
    this.misignalService.clickedRows.clear();

  }





// Se actualiza el estado de la señal primeraBusqueda
// (que controla si se muestra el error de encontrar cliente) con cambios de pestaña o cierre de sesión
  resetPantalla() {
    this.misignalService.setPrimeraBusqueda(false); // Resetea la señal al cambiar de pestaña
    this.misignalService.setClienteEncontradoDeMain(false);
    this.misignalService.cuadernoSeleccionado.set(false);
    this.misignalService.tipoCuadernoSignal.set('');
    this.selectedTab.set(0);
    this.misignalService.filaSeleccionada.set(0);
    this.misignalService.clickedRows.clear(); //limpio lo seleccionado en migrar 
  }

  cargarClienteDesdeMain(idClienteMain:string){
    this.misignalService.cuadernoSeleccionado.set(false);
    this.misignalService.setClienteEncontradoDeMain(false);
    this.misignalService.tipoCuadernoSignal.set('');

    if (Number(idClienteMain)==1||Number(idClienteMain)==0){ //debería cambiar a un array que controle los usuarios que sí existen
      this.jsonDatoService.buscarPorCliente(idClienteMain).subscribe((resp:ClienteJsonInterface)=>
              {console.log(resp),


                this.misignalService.objetoCliente.set(resp);//enviamos el objeto obtenido del json a la señal
                this.misignalService.setClienteEncontradoDeMain(true);
              });

    }else{
      // Asegura que el componente ByAdministrar esté visible comprobando si la ruta activa incluye 'by-administrar'
      this.selectedTab.set(0); //redirige a la primera pestaña
      this.misignalService.setClienteEncontradoDeMain(false);

      if(idClienteMain=='2'){
        this.misignalService.setTipoError("404 Not Found: Usuario no encontrado.");
      }else{
        if(isNaN(Number(idClienteMain))){ //comprueba que no es numerico
          this.misignalService.setTipoError("500 Internal Server Error: ID no numérica.");
        }else{
          this.misignalService.setTipoError("400 Bad Request: El usuario no existe.");
        }

      }


    }

  }

}
