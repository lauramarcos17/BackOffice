import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Migracion } from 'app/shared/interfaces/Migracion.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';


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
  imports: [MatLabel,MatFormField,MatSortModule,MatInputModule,MatFormFieldModule,MatButtonModule, MatTooltipModule,MatTableModule,MatPaginator],
  templateUrl: './mig-manual.component.html',
  styleUrl: 'mig-manual.component.css',
})
export class MigManualComponent {

  @Input() mapa!: Map<string, string>;
  displayedColumns: string[] = ['clienteOrigen', 'clienteDestino','fechaHoraInicioOperacion','fechaHoraFinOperacion','operacion','resultado','descripcion'];
  dataSource = new MatTableDataSource<Migracion>(ELEMENT_DATA);
  private _liveAnnouncer = inject(LiveAnnouncer); //para ordenar tabla con Matsort

  jsonDatoService=inject(JsonDatoService);
   clickedRows = new Set<Migracion>(); //guarda los clicks
   filaSeleccionada = signal<boolean>(false);

   
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.cargarMigraciones();
  }

  announceSortChange(sortState: Sort) {
   //para ordenar columnas de la tabla
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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


   seleccionarCopia(row: any){
        if(!this.clickedRows.has(row)){ //cambio de selección
          this.clickedRows.clear();
          this.clickedRows.add(row)
          this.filaSeleccionada.set(true); 
        }else{ //Dejamos de seleccionar
          this.clickedRows.clear();
          this.filaSeleccionada.set(false);
        }
        // alert(row.fechaHora);
      }

 }
