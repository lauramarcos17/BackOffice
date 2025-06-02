import { Component, computed, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLabel } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { MigManualComponent } from './mig-manual/mig-manual.component';
import { MigMasivaComponent } from './mig-masiva/mig-masiva.component';
import { MiSignalService } from '../../shared/services/mi-signal.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
@Component({
  selector: 'app-by-migrar',
  imports: [MatRadioModule,MatDividerModule,MigManualComponent,MigMasivaComponent, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './by-migrar.component.html',
  styleUrl: 'by-migrar.component.css',
})
export class ByMigrarComponent {


  misignalService=inject(MiSignalService);
  private _snackBar = inject(MatSnackBar);
  tipoMigracion=this.misignalService.tipoMigracion;

  rolEsAdmin = computed(() => this.misignalService.rol() == 1);

  textosGuiaFacil = new Map<string, string>([
    ['guia', 'Este menú permite realizar la migración de la información de un usuario Origen a un usuario Destino. La migración se puede realizar de dos formas distintas: manual y masiva.'],
    ['manual', 'Esta opción permite realizar la migración entre dos usuarios que se especifiquen en las cajas de texto.'],
    ['masiva','Esta opción permite realizar la migración entre los usuarios que se especifiquen mediante un fichero excel con las siguientes características: \n Dispondrá de las cabeceras: USUARIO ORIGEN, USUARIO DESTINO y FORZAR. \n Se indicará los usuarios Origen y Destino.\n En caso de que el usuario Destino haya formado parte de otra migración sólo se migrará si se añade un carácter “C” en la columna FORZAR.\n El máximo número de registros son 1001.'],
    ['migrar','Permite migrar los datos de un usuario Origen, siempre que tenga datos, a otro usuario Destino.'],
    ['limpiar','Esta acción no se puede deshacer. Se eliminan la copia de seguidad de los usuarios que se generaron en la migración y el registro de la operación en la tabla de migraciones.'],
    ['restaurar','Esta acción no se puede deshacer. Vuelve al estado previo a la migración, recuperando la información de las copias de seguridad. Si el usuario Origen o Destino hubiesen añadido información tras la migración, esta se perderá. La migración restaurada sigue disponible. Esto permite restaurarla de nuevo si fuera necesario.'],
    ['exportar','Genera un fichero excel con el resultado de la migración.'],
    ['ayuda','Ayuda']
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
