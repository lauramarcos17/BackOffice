import { MiSignalService } from './../../shared/services/mi-signal.service';
import { mainroutes } from './../main.routes';
import { ChangeDetectionStrategy, Component, computed, inject, input, Input, signal } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ByAdministrarComponent } from '../by-administrar/by-administrar.component';
import { ByCopiasComponent } from "../by-copias/by-copias.component";
import { ByHistoricoComponent } from '../by-historico/by-historico.component';
import { ByMigrarComponent } from '../by-migrar/by-migrar.component';
import { ByLogsComponent } from '../by-logs/by-logs.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { JsonDatoService } from '../../shared/services/jsonDato.service';
import { ClienteJsonInterface } from 'app/shared/interfaces/ClienteJson.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-main-page',
  imports: [MatInputModule, MatFormFieldModule, MatTabsModule,MatCardModule,MatIconModule, MatButtonModule,RouterOutlet, RouterLink, ByAdministrarComponent, ByCopiasComponent,ByHistoricoComponent,ByMigrarComponent,ByLogsComponent],
  templateUrl: './main-page.component.html',
  styleUrl:'main-page.component.css'


})
export class MainPageComponent {
  router = inject(Router);
  misignalService=inject(MiSignalService);
  jsonDatoService=inject(JsonDatoService);
  mensaje= this.misignalService.mensaje;
  rolNombre=this.misignalService.nombrerol;
  // rol=this.misignalService.rol;

  clienteEncontradoDesdeMain = computed(()=> this.misignalService.clienteEncontradoDeMain());
  selectedTab = signal(0);







// Se actualiza el estado de la señal primeraBusqueda
// (que controla si se muestra el error de encontrar cliente) con cambios de pestaña o cierre de sesión
  resetPantalla() {
    this.misignalService.setPrimeraBusqueda(false); // Resetea la señal al cambiar de pestaña
    this.misignalService.setClienteEncontradoDeMain(false);
  }

  cargarClienteDesdeMain(idClienteMain:string){
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
