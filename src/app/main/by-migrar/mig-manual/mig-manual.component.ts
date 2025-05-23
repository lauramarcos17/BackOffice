import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Migracion } from 'app/shared/interfaces/Migracion.interface';


// export interface Manual{
//   usuariOrigen:string;
//   usuarioDestino:string;
//   fechaInicioOperacion: string;
//   fechaFinOperacion: string;
//   operacion:number;
//   resultado: string;
//   descripcion: string;
// }
const ELEMENT_DATA: Migracion[] = [

];

@Component({
  selector: 'app-mig-manual',
  imports: [MatLabel,MatFormField,MatInputModule,MatFormFieldModule,MatButtonModule, MatTooltipModule,MatTableModule],
  templateUrl: './mig-manual.component.html',
  styleUrl: 'mig-manual.component.css',
})
export class MigManualComponent {

  @Input() mapa!: Map<string, string>;
  displayedColumns: string[] = ['clienteOrigen', 'clienteDestino','fechaHoraInicioOperacion','fechaHoraFinOperacion','operacion','resultado','descripcion'];
  dataSource = new MatTableDataSource<Migracion>(ELEMENT_DATA);

  jsonDatoService=inject(JsonDatoService)

  ngOnInit() {
    this.cargarMigraciones();
  }

  cargarMigraciones() {
    setTimeout(() => {
    this.jsonDatoService.getMigraciones().subscribe({
      next: (migraciones) => {

          this.dataSource.data = migraciones;


      },
      error: (err) => {
        console.error('Error cargando migraciones', err);
      }
    });
    }, 300);
  }

  crearMigracion(clienteOrigen: string, clienteDestino: string) {
    this.jsonDatoService.crearMigracion(clienteOrigen, clienteDestino).subscribe({
      next: (nuevaMigracion) => {
        // Recarga la tabla tras crear

        setTimeout(() => {
          this.cargarMigraciones();
        }, 300);
      },
      error: (err) => {
        console.error('Error creando migración', err);
      }
    });
    setTimeout(() => {
      this.cargarMigraciones();
    },300);
  }
 }
