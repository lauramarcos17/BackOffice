import { Component, computed, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { MigManualComponent } from './mig-manual/mig-manual.component';
import { MigMasivaComponent } from './mig-masiva/mig-masiva.component';
import { MiSignalService } from '../../shared/services/mi-signal.service';

@Component({
  selector: 'app-by-migrar',
  imports: [MatRadioModule,MatDividerModule,MigManualComponent,MigMasivaComponent],
  templateUrl: './by-migrar.component.html',
  styleUrl: 'by-migrar.component.css',
})
export class ByMigrarComponent {

  tipoMigracion=signal<number>(0);
  misignalService=inject(MiSignalService);


  rolEsAdmin = computed(() => this.misignalService.rol() == 1);
  
 }
