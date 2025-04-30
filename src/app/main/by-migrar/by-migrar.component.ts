import { Component, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { MigManualComponent } from './mig-manual/mig-manual.component';
import { MigMasivaComponent } from './mig-masiva/mig-masiva.component';

@Component({
  selector: 'app-by-migrar',
  imports: [MatRadioModule,MatDividerModule,MigManualComponent,MigMasivaComponent],
  templateUrl: './by-migrar.component.html',
  styleUrl: 'by-migrar.component.css',
})
export class ByMigrarComponent {
 
  tipoMigracion=signal<number>(0);
 }
