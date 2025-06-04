import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Backup } from 'app/shared/interfaces/Backup.interface';
import { CopiaSeguridadJson } from 'app/shared/interfaces/CopiaSeguridadJson.interface';
import { Log } from 'app/shared/interfaces/Log.interface';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { MiSignalService } from 'app/shared/services/mi-signal.service';

const ELEMENT_DATA: Backup[] = [
]


@Component({
  selector: 'app-tabla-copia',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './tabla-copia.component.html',
  styleUrls: ['../by-copias.component.css'],
})


export class TablaCopiaComponent {

 misignalService = inject(MiSignalService)
  jsonDatoService = inject(JsonDatoService);
  private _liveAnnouncer = inject(LiveAnnouncer); //para ordenar tabla


  cliente= this.misignalService.objetoCliente(); //json completo del cliente
  clienteId = computed(() => this.misignalService.objetoCliente()?.id?.toString() ?? ''); //id numerico del cliente en String
  clienteElegido = computed (()=> this.misignalService.clienteElegido()); //booleano que muestra si se ha elegido cliente. No usado en este componente?
  mostrarTablaTotales = computed (()=> this.misignalService.mostrarTablaTotales());
  nombrerol=this.misignalService.nombrerol();

  fechaDesde = signal<Date | null>(null);
  fechaHasta = signal<Date | null>(null);

  backups = signal<Backup[]>([]);

  clickedRows = new Set<Backup>();



  filaSeleccionada = signal<boolean>(false);


 constructor() {
    effect(() => {
      const actualizar = this.misignalService.actualizarBackup();
      const cliente = this.misignalService.objetoCliente();

      if (cliente && cliente.id !== undefined && cliente.id !== null) {
        this.cargarBackups();
         this.misignalService.actualizarBackup.set(false);

      }

      //para detectar cada vez que creo una copia


    });
  }





  //aplica un filtro parseando la fecha tipo String de SQL a tipo Date para comparar
  backupsFiltrados = computed(() => {
    const desde = this.fechaDesde();
    const hasta = this.fechaHasta();
    let hastaFin: Date | null = null;
    if (hasta) {
      hastaFin = new Date(hasta);
      hastaFin.setHours(23, 59, 59, 999);
    }
    return this.backups().filter(b => {
      const fecha = this.parseFecha(b.fechaHora);
      if (!fecha) return false;
      return (!desde || fecha >= desde) && (!hastaFin || fecha <= hastaFin);
    });
  });


   displayedColumns: string[] = ['cliente', 'fechaHora', 'descripcion'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

   ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      if (property === 'fechaHora') {
        const fechaStr: string = item[property];
        if (!fechaStr) return 0;
        const [fecha, hora] = fechaStr.split(' - ');
        if (!fecha || !hora) return 0;
        const [dia, mes, anio] = fecha.split('/').map(Number);
        const [h, m, s] = hora.split(':').map(Number);
        // Devuelve SIEMPRE un número
        const time = new Date(anio, mes - 1, dia, h, m, s).getTime();
        return isNaN(time) ? 0 : time;
      }
      // Por defecto, devuelve el valor tal cual
      return item[property];
    };

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarBackups();
  }

  /*ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarBackups();
  }*/

  announceSortChange(sortState: Sort) {
   //para ordenar columnas de la tabla
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  ngOnInit() {
     const id = this.clienteId().toString;
       this.cargarBackups();



    }

    ngOnChanges() {
       this.dataSource.data=[];
      const id = this.clienteId();
       if (id) {
      this.cargarBackups();
    }
    }


    crearCopia(){
      this.misignalService.clienteEncontradoDeMain.set(false);
      this.misignalService.clienteEncontradoDeMain.set(true);
      this.misignalService.mostrarTablaTotales.set(!this.mostrarTablaTotales());
      this.misignalService.cuadernoSeleccionado.set(false);
  }

    cargarBackups() {

      const clienteobjeto = this.misignalService.objetoCliente();
      const cliente = clienteobjeto?.id?.toString() ?? '';

      console.log('Cliente ID usado para buscar backups:', cliente);
      this.jsonDatoService.getBackups(cliente).subscribe({
        next: (backups) => {
          this.backups.set(backups);
          this.dataSource.data = this.backupsFiltrados(); // Inicializa la tabla con los filtrados

        },
        error: (err) => {
          console.error('Error cargando backups', err);
        }
      });
    }

      textosGuiaFacil = new Map<string, string>([
      ['guia_copias', 'Desde este menú podrá gestionar las copias de seguridad de AEBWeb. Una copia de seguridad almacena todos los datos que tiene un cliente en los cuadernos SEPA. \n Solamente se permite una copia de seguridad por cliente. Si se hace una segunda copia se machaca la anterior.'],
      ['buscar_copias', 'Para encontrar una determinada copia de seguridad puede usar los campos de búsqueda por usuario o fecha y pulsar .'],
      ['vertodas_copias', 'Para listar todas las copias almacenadas.'],
      ['restaurar_copias', 'Permite restaurar la información de un usuario de AEBWeb utilizando su copia de seguridad. Antes de restaurar la información se le mostrará, a modo de confirmación, un resumen de los datos almacenados en la copia. (Importante: Toda la información del usuario de AEBWeb, en los cuadernos SEPA, se eliminará antes de cargarle los datos de la copia de seguridad).'],
      ['eliminar_copias', 'Borrará toda la información de la copia de seguridad seleccionada.'],
      ['crear_copias', 'Conducirá a una pantalla donde podrá seleccionar el usuario para el que desea crear una copia de seguridad. En dicha pantalla se mostrará , a modo de confirmación, un resumen de los datos del usuario.']



    ]);





    aplicarFiltroFechas() {
      const desde = this.fechaDesde();
      let hasta = this.fechaHasta();

      // Si hay fecha hasta, ajústala al final del día
      let hastaFin: Date | null = null;
      if (hasta) {
        hastaFin = new Date(hasta);
        hastaFin.setHours(23, 59, 59, 999);
      }

      this.dataSource.data = this.backups().filter(b => {
        const fecha = this.parseFecha(b.fechaHora);
        if (!fecha) return false;
        return (!desde || fecha >= desde) && (!hastaFin || fecha <= hastaFin);
      });
    }

    verTodasFechas() {
      this.fechaDesde.set(null);
      this.fechaHasta.set(null);
      this.dataSource.data = this.backups();
    }

    private parseFecha(fechaStr: string): Date | null {
      // Espera formato: "14/05/2025 - 14:13:30" segun el String de SQL
      const [fecha, hora] = fechaStr.split(' - ');
      if (!fecha || !hora)
        return null;
      const [dia, mes, anio] = fecha.split('/').map(Number);
      const [h, m, s] = hora.split(':').map(Number);
      return new Date(anio, mes - 1, dia, h, m, s);
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

      eliminarCopia(){
        const row = Array.from(this.clickedRows)[0];
        if (!row) return;
        //añado el .trim() para quitar los espacios al final
        this.jsonDatoService.eliminarCopia(row.cliente.trim(), row.fechaHora.trim()).subscribe({
          next: () => {
            // Elimina la fila del array local y refresca la tabla
            this.backups.set(this.backups().filter(b => !(b.cliente === row.cliente && b.fechaHora === row.fechaHora)));
            this.dataSource.data = this.backupsFiltrados();
            this.clickedRows.clear();
            this.filaSeleccionada.set(false);
        
            this.mandaLogBruto(row,"Copia de seguridad eliminada");
          },
          error: err => {
            alert('Error al eliminar la copia');
            console.error(err);
          }
        });
      }

      restaurarCopia(){
        const row = Array.from(this.clickedRows)[0]; //obtenemos la fila de la copia seleccionada
        alert("Copia de seguridad restaurada a fecha de: "+row.fechaHora.trim());
        this.jsonDatoService.restaurarCopiaSeguridad(this.clienteId()).subscribe((resp: CopiaSeguridadJson) => {
                console.log(resp),
                this.misignalService.copiaSeguridad.set(resp);

               

                //Al crear una copia cambio la señal para que se ejecute el efecto
                this.misignalService.actualizarBackup.set(true);
             
                this.mandaLogBruto(row,"Copia de seguridad restaurada");

            });
              //ponemos tiempo para cambiar a la otra pestaña porque si no no actualiza al momento las copias
               setTimeout(() => {
               this.cargarBackups()
            }, 400);
              console.log(this.misignalService.mostrarTablaTotales());
      }

       mandaLogBruto(row : CopiaSeguridadJson,operacion:string){ //TIENE QUE RECIBIR UN LOG QUE SE GENERE EN CADA ACCIÓN
                
                  const logBruto= {
                          id:0,
                          fechaInicio: row.fechaHora,
                          fechaFin: this.addHoursToISOString(row.fechaHora),
                          usuario: this.nombrerol,
                          cuaderno: this.misignalService.tipoCuadernoSignal(),
                          operacion: operacion,
                          descripcion: row.descripcion,
                          cliente: this.misignalService.objetoCliente()!.id.toString()
                        };
               console.log(logBruto);
                 this.jsonDatoService.crearLog(logBruto).subscribe((resp: Log) => {
                        console.log(resp);
              },
           )}

          addHoursToISOString(dateStr: string): string {
            const [datePart, timePart] = dateStr.split(" - ");
            const [day, month, year] = datePart.split("/").map(Number);
            const [hours, minutes, seconds] = timePart.split(":").map(Number);

            // Crear la fecha en UTC (mes en JavaScript va de 0 a 11)
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
            date.setUTCHours(date.getUTCHours() + 1);

            // Formatear como "dd/MM/yyyy - HH:mm:ss"
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formatted = `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} - ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
            return formatted;
          }



}
