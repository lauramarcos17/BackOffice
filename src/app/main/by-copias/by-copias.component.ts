import { TablaCopiaComponent } from './tabla-copia/tabla-copia.component';
import { AfterViewInit, Component, inject, ViewChild, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MiSignalService } from '../../shared/services/mi-signal.service';
import { Backup } from 'app/shared/interfaces/Backup.interface';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { TablaTotalesComponent } from './tabla-totales/tabla-totales.component';




const ELEMENT_DATA: Backup[] = [
]


@Component({

  selector: 'app-by-copias',
  imports: [TablaCopiaComponent,TablaTotalesComponent,FormsModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './by-copias.component.html',
  styleUrl: 'by-copias.component.css',
  providers: [provideNativeDateAdapter()]
})


export class ByCopiasComponent implements AfterViewInit {

  private _liveAnnouncer = inject(LiveAnnouncer);
  private _snackBar = inject(MatSnackBar);
  misignalService = inject(MiSignalService)
  jsonDatoService = inject(JsonDatoService);

  cliente= this.misignalService.objetoCliente(); //json completo del cliente
  clienteId = computed(() => this.misignalService.objetoCliente()?.id?.toString() ?? ''); //id numerico del cliente en String
  clienteElegido = computed (()=> this.misignalService.clienteElegido()); //booleano que muestra si se ha elegido cliente. No usado en este componente?
  mostrarTablaTotales = computed (()=> this.misignalService.mostrarTablaTotales());



  fechaDesde = signal<Date | null>(null);
  fechaHasta = signal<Date | null>(null);

  backups = signal<Backup[]>([]);

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






  textosGuiaFacil = new Map<string, string>([
    ['guia_copias', 'Desde este menú podrá gestionar las copias de seguridad de AEBWeb. Una copia de seguridad almacena todos los datos que tiene un cliente en los cuadernos SEPA. \n Solamente se permite una copia de seguridad por cliente. Si se hace una segunda copia se machaca la anterior.'],
    ['buscar_copias', 'Para encontrar una determinada copia de seguridad puede usar los campos de búsqueda por usuario o fecha y pulsar [Buscar].'],
    ['vertodas_copias', 'Para listar todas las copias almacenadas, pulse [Ver Todas]'],
    ['restaurar_copias', 'Permite restaurar la información de un usuario de AEBWeb utilizando su copia de seguridad. Antes de restaurar la información se le mostrará, a modo de confirmación, un resumen de los datos almacenados en la copia. (Importante: Toda la información del usuario de AEBWeb, en los cuadernos SEPA, se eliminará antes de cargarle los datos de la copia de seguridad).'],
    ['eliminar_copias', 'Borrará toda la información de la copia de seguridad seleccionada.'],
    ['crear_copias', 'Conducirá a una pantalla donde podrá seleccionar el usuario para el que desea crear una copia de seguridad. En dicha pantalla se mostrará , a modo de confirmación, un resumen de los datos del usuario.']


  ]);



  displayedColumns: string[] = ['cliente', 'fechaHora', 'descripcion'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarBackups();
  }

  announceSortChange(sortState: Sort) {
   //para ordenar columnas de la tabla
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar() {
    console.log("Se imprime?" +this.misignalService.objetoCliente()!.nombre); //borrar

    this._snackBar.open(this.textosGuiaFacil.get("guia_copias")!, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration:5000,
      panelClass: ['snackbar-pre']
    });
  }

  constructor(private dialog: MatDialog) {
    effect(() => {
      const cliente = this.misignalService.objetoCliente();
      if (cliente && cliente.id !== undefined && cliente.id !== null) {
        this.cargarBackups();
      }
    });
  }
  cambiarLaura(){
    this.misignalService.mostrarTablaTotales.set(!this.mostrarTablaTotales());
  }
  
//para obtener datos de Backup
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
}


