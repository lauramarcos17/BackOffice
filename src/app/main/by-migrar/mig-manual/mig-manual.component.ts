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
import { MatDividerModule } from '@angular/material/divider';
import * as XLSX from 'xlsx';


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
   filaSeleccionada = signal<number>(0);
   nombrerol=this.misignalService.nombrerol();
   rol = this.misignalService.rol;



  textosGuiaFacil = new Map<string, string>([
    ['seleccionar', 'Permite seleccionar todas las migraciones del listado'],
    ['restaurar','Pemite restaurar una o varias migraciones. Si no hay ninguna migracción seleccionada aparecerá desactivado'] ,
    ['limpiar','Permite limpiar una o varias migraciones. Si no hay ninguna migración seleccionada aparecerá desactivado'],
    ['exportar','Permite exportar una o varias migraciones en formato xls. Si no hay ninguna migración seleccionada aparecerá desactivado']


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
          /*this.clickedRows.clear();*/
          this.clickedRows.add(row)
          this.filaSeleccionada.update(value=>value+1);
        }else{ //Dejamos de seleccionar
          /*this.clickedRows.clear();*/
          this.clickedRows.delete(row);
          this.filaSeleccionada.update(value=>value-1);
        }
        // alert(row.fechaHora);

      }

  eliminarMigracion() {
    const rowsToDelete = Array.from(this.clickedRows);
    if (rowsToDelete.length === 0) return;

    // Confirmación opcional
    if (!confirm(`¿Seguro que quieres eliminar ${rowsToDelete.length} migración(es) seleccionada(s)?`)) return;

    let eliminadas = 0;
    rowsToDelete.forEach(row => {
      this.jsonDatoService.eliminarMigracion(row.clienteOrigen.trim(), row.fechaHoraInicioOperacion.trim()).subscribe({
        next: () => {
          // Elimina del array local
          this.migraciones.set(
            this.migraciones().filter(b =>
              !(b.clienteOrigen === row.clienteOrigen && b.fechaHoraInicioOperacion === row.fechaHoraInicioOperacion)
            )
          );
           this.mandaLogBruto(row, "Migración eliminada"); //para enviar a Logs
          eliminadas++;
          // Cuando termine la última, actualiza la tabla y limpia selección
          if (eliminadas === rowsToDelete.length) {
            this.dataSource.data = this.migraciones();
            this.clickedRows.clear();
            this.filaSeleccionada.set(0);
          }
        },
        error: err => {
          alert('Error al eliminar la migración');
          console.error(err);
        }
      });

      // Log de eliminación (opcional)
     
  });
}

    restaurarMigracion(){
      const row = Array.from(this.clickedRows)[0]; //obtenemos la fila de la copia seleccionada
      if (!row) return;
      if(!row.operacion.includes("Restauración")) {
        if (!confirm(`¿Seguro que quieres restaurar la migración seleccionada?`)) return;
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
    else {
      alert("No se puede restaurar una migración restaurada.");
    }
  }
  

    seleccionarTodos()
    {
     this.dataSource.data.forEach(row => this.clickedRows.add(row));
     this.filaSeleccionada.set(this.dataSource.data.length);
    }

    exportarSeleccionadas(){
      const rowsToExport = Array.from(this.clickedRows);
      if (rowsToExport.length === 0) {
        alert('No hay migraciones seleccionadas para exportar.');
        return;
      }

      const data = rowsToExport.map(row => ({
        'Usuario Origen': row.clienteOrigen,
        'Usuario Destino': row.clienteDestino,
        'Fecha Inicio': row.fechaHoraInicioOperacion,
        'Fecha Fin': row.fechaHoraFinOperacion,
        'Operación': row.operacion,
        'Resultado': row.resultado,
        'Descripción': row.descripcion
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Migraciones');

      // Formatea la fecha actual como yyyyMMdd_HHmmss
      const now = new Date();
      const fechaStr = now.toISOString().slice(0,19).replace(/[-:T]/g, '').replace(/(\d{8})(\d{6})/, '$1_$2');
      const filename = `Migraciones_${fechaStr}.xlsx`;

      XLSX.writeFile(workbook, filename);
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
