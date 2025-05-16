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

@Component({
  selector: 'app-main-page',
  imports: [MatTabsModule,MatCardModule,MatIconModule, MatButtonModule,RouterOutlet, RouterLink, ByAdministrarComponent, ByCopiasComponent,ByHistoricoComponent,ByMigrarComponent,ByLogsComponent],
  templateUrl: './main-page.component.html',
  styleUrl:'main-page.component.css'


})
export class MainPageComponent {
  router = inject(Router);
  misignalService=inject(MiSignalService);
  mensaje= this.misignalService.mensaje;
  rolNombre=this.misignalService.nombrerol;
  rol=this.misignalService.rol;

  clienteElegido = computed (()=> this.misignalService.clienteElegido());





// Se actualiza el estado de la señal primeraBusqueda
// (que controla si se muestra el error de encontrar cliente) con cambios de pestaña o cierre de sesión
  resetPantalla() {
    this.misignalService.setPrimeraBusqueda(false); // Resetea la señal al cambiar de pestaña
  }

}
