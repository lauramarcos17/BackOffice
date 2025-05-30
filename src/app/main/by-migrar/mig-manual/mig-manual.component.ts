import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { Component, inject, Input, signal, ViewChild, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Migracion } from 'app/shared/interfaces/Migracion.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MiSignalService } from 'app/shared/services/mi-signal.service';
import { Log } from 'app/shared/interfaces/Log.interface';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';


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
  imports: [MatLabel,MatTooltipModule,MatFormField,MatSortModule,MatInputModule,MatFormFieldModule,MatButtonModule, MatTooltipModule,MatTableModule,MatPaginator,MatDividerModule],
  templateUrl: './mig-manual.component.html',
  styleUrl: 'mig-manual.component.css',
})
export class MigManualComponent {

  @Input() mapa!: Map<string, string>;
  displayedColumns: string[] = ['clienteOrigen', 'clienteDestino','fechaHoraInicioOperacion','fechaHoraFinOperacion','operacion','resultado','descripcion'];
  dataSource = new MatTableDataSource<Migracion>(ELEMENT_DATA);
  private _liveAnnouncer = inject(LiveAnnouncer); //para ordenar tabla con Matsort

  misignalService = inject(MiSignalService);
  jsonDatoService=inject(JsonDatoService);

   clickedRows = new Set<Migracion>(); //guarda los clicks
   migraciones = signal<Migracion[]>([]);
   filaSeleccionada = signal<boolean>(false);
   nombrerol=this.misignalService.nombrerol();
   rol = this.misignalService.rol;



  textosGuiaFacil = new Map<string, string>([
    ['seleccionar', 'Permite seleccionar todas las migraciones del listado'],
    ['restaurar','Pemite restaurar una o varias migraciones. Si no hay ninguna migracción seleccionada aparecerá desactivado'] ,
     ['limpiar','Permite limpiar una o varias migraciones.Si no hay ninguna migración seleccionada aparecerá desactivado']


  ]);



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
          this.migraciones.set(migraciones);
          this.dataSource.data = migraciones;


      },
      error: (err) => {
        console.error('Error cargando migraciones', err);
      }
    });
    }, 300);
  }

  /*
     this.jsonDatoService.getBackups(cliente).subscribe({
        next: (backups) => {
          this.backups.set(backups);

  */

  crearMigracion(clienteOrigen: string, clienteDestino: string) {
    this.jsonDatoService.crearMigracion(clienteOrigen.trim(), clienteDestino.trim()).subscribe({
      next: (nuevaMigracion) => {


        console.log(nuevaMigracion); //objeto que recibimos al crear una migración desde spring
        this.mandaLogBruto(nuevaMigracion, "Migración creada");

        // Recarga la tabla tras crear
        setTimeout(() => {
          this.cargarMigraciones();

        }, 300);


      },
      error: (err) => {
        console.error('Error creando migración', err);
        alert("Error al crear la migración: "+err);
      }
    });
    setTimeout(() => {
      this.cargarMigraciones();
    },300);


  }


   seleccionarMigracion(row: any){
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

       eliminarMigracion(){

              const row = Array.from(this.clickedRows)[0];
              if (!row) return;
              //añado el .trim() para quitar los espacios al final
              this.jsonDatoService.eliminarMigracion(row.clienteOrigen.trim(), row.fechaHoraInicioOperacion.trim()).subscribe({
                next: () => {
                  // Elimina la fila del array local y refresca la tabla
                  this.migraciones.set(this.migraciones().filter(b => !(b.clienteOrigen === row.clienteOrigen && b.fechaHoraInicioOperacion === row.fechaHoraInicioOperacion)));
                  this.dataSource.data = this.migraciones();
                  this.clickedRows.clear();
                  this.filaSeleccionada.set(false);
                },
                error: err => {
                  alert('Error al eliminar la copia');
                  console.error(err);
                }
              });

              //recojo datos de columna que hago click para guardar en la base de datos de logs y luego pintar info

              this.mandaLogBruto(row,"Migración eliminada");


            }

    restaurarMigracion(){
      const row = Array.from(this.clickedRows)[0]; //obtenemos la fila de la copia seleccionada
      if (!row) return;
      alert("Migracion restaurada a fecha de: " + row.fechaHoraInicioOperacion.trim());
      this.jsonDatoService.restaurarMigracion(row.clienteOrigen.trim(), row.clienteDestino.trim()).subscribe((resp: Migracion) => {
              console.log(resp);
              // Actualiza la lista de migraciones agregando la respuesta
              this.migraciones.update((prev) => [...prev, resp]);
             // alert("Esto es el objeto resp --> " + JSON.stringify(resp, null, 2));
              // Al crear una copia cambio la señal para que se ejecute el efecto

        });


      // Si necesitas recargar migraciones después de restaurar, llama a cargarMigraciones
      setTimeout(() => {
        this.cargarMigraciones();
      }, 400);
       this.mandaLogBruto(row,"Migración restaurada");

    }


    mandaLogBruto(row : Migracion, operacion:string){ //TIENE QUE RECIBIR UN LOG QUE SE GENERE EN CADA ACCIÓN
      // alert("mandando log");
        const logBruto= {
                fechaInicio: row.fechaHoraInicioOperacion,
                fechaFin: row.fechaHoraFinOperacion,
                usuario: this.nombrerol,
                cuaderno: 'Todos',
                operacion: operacion,
                descripcion: row.descripcion,
                cliente: this.misignalService.objetoCliente()!.id.toString()
              };

       this.jsonDatoService.crearLog(logBruto).subscribe((resp: Log) => {
              console.log(resp);
    },
 )}

}
