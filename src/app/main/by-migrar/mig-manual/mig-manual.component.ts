import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { Component, inject, Input, signal, ViewChild, computed, effect } from '@angular/core';
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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


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
  imports: [CommonModule, MatLabel,MatIconModule,MatIcon,MatTooltipModule,MatFormField,MatSortModule,MatInputModule,MatFormFieldModule,MatButtonModule, MatTooltipModule,MatTableModule,MatPaginator,MatDividerModule],
  templateUrl: './mig-manual.component.html',
  styleUrl: 'mig-manual.component.css',
})
export class MigManualComponent {

  @Input() mapa!: Map<string, string>;
  displayedColumns: string[] = ['id','clienteOrigen', 'clienteDestino','fechaHoraInicioOperacion','fechaHoraFinOperacion','operacion','resultado','descripcion'];
  dataSource = new MatTableDataSource<Migracion>(ELEMENT_DATA);
  private _liveAnnouncer = inject(LiveAnnouncer); //para ordenar tabla con Matsort

  misignalService = inject(MiSignalService);
  jsonDatoService=inject(JsonDatoService);

    //guarda los clicks
   migraciones = signal<Migracion[]>([]);

  clienteId = computed(() => this.misignalService.objetoCliente()?.id?.toString() ?? '');

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
    // Personaliza el ordenamiento para las fechas
    this.dataSource.sortingDataAccessor = (item:any, property:any) => {
      if (property === 'fechaHoraInicioOperacion' || property === 'fechaHoraFinOperacion') {
        // Espera formato "dd/MM/yyyy - HH:mm:ss"
        const fechaStr = item[property];
        if (!fechaStr) return 0;
        const [fecha, hora] = fechaStr.split(' - ');
        if (!fecha || !hora) return 0;
        const [dia, mes, anio] = fecha.split('/').map(Number);
        const [h, m, s] = hora.split(':').map(Number);
        return new Date(anio, mes - 1, dia, h, m, s).getTime();
      }
      // Por defecto, devuelve el valor tal cual
      return item[property];
    };

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //   constructor(private dialog: MatDialog) {
  //   effect(() => {
  //     //const actualizar=this.misignalService.actualizarBackup();
  //     const cliente = this.misignalService.objetoCliente();
  //     if (cliente && cliente.id !== undefined && cliente.id !== null) {
  //       this.cargarBackups();

  //     }
  //   });
  // }
  // cambiarLaura(){
  //   this.misignalService.mostrarTablaTotales.set(!this.mostrarTablaTotales());
  // }

  constructor(private dialog: MatDialog) {
    effect(() => {
      const cliente = this.misignalService.objetoCliente();
       if (cliente && cliente.id !== undefined && cliente.id !== null) {
         this.cargarMigraciones();
         this.misignalService.clickedRows.clear();
          this.misignalService.filaSeleccionada.set(0);
       }
    });
  }

  ngOnInit() {
    this.cargarMigraciones();
  }

  ngOnChanges(){
    this.misignalService.clickedRows.clear();
    this.misignalService.filaSeleccionada.set(0);
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
    this.jsonDatoService.getMigraciones(this.clienteId()).subscribe({
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

    this.misignalService.clickedRows.clear();
    this.misignalService.filaSeleccionada.set(0);

  }


   seleccionarMigracion(row: any){
        if(!this.misignalService.clickedRows.has(row)){ //cambio de selección
          /*this.clickedRows.clear();*/
          this.misignalService.clickedRows.add(row)
          this.misignalService.filaSeleccionada.update(value=>value+1);
        }else{ //Dejamos de seleccionar
          /*this.clickedRows.clear();*/
          this.misignalService.clickedRows.delete(row);
          this.misignalService.filaSeleccionada.update(value=>value-1);
        }
        // alert(row.fechaHora);

      }

  eliminarMigracion() {
    const rowsToDelete = Array.from(this.misignalService.clickedRows);
    if (rowsToDelete.length === 0) return;

    // Confirmación opcional
    if (!confirm(`¿Seguro que quieres eliminar ${rowsToDelete.length} migración(es) seleccionada(s)?`)) return;

    let eliminadas = 0;
    rowsToDelete.forEach(row => {
      this.jsonDatoService.eliminarMigracion(row.id).subscribe({
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
            this.misignalService.clickedRows.clear();
            this.misignalService.filaSeleccionada.set(0);
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
      const row = Array.from(this.misignalService.clickedRows)[0]; //obtenemos la fila de la copia seleccionada
      if (!row) return;
      if(!row.operacion.includes("Restauración")) {
        if (!confirm(`¿Seguro que quieres restaurar la migración seleccionada?`)) return;
        alert("Migracion restaurada a fecha de: " + row.fechaHoraInicioOperacion.trim());
        this.jsonDatoService.restaurarMigracion(row.clienteOrigen.trim(), row.clienteDestino.trim(), row.id.toString().trim()).subscribe((resp: Migracion) => {
          console.log("ROOOOOOW: "+row.id)
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
    this.misignalService.clickedRows.clear();
            this.misignalService.filaSeleccionada.set(0);
  }


    seleccionarTodos()
    {
     this.dataSource.data.forEach(row => this.misignalService.clickedRows.add(row));
     this.misignalService.filaSeleccionada.set(this.dataSource.data.length);
    }

    exportarSeleccionadas(){
      const rowsToExport = Array.from(this.misignalService.clickedRows);
      if (rowsToExport.length === 0) {
        alert('No hay migraciones seleccionadas para exportar.');
        return;
      }

      const data = rowsToExport.map(row => ({
        'ID':row.id,
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
                id:0,
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

    aplicarFiltro(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    limpiarFiltro() {
      this.dataSource.filter = '';
    }

}
