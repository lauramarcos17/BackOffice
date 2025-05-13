import { ResumenClienteDialogComponent } from './Resumen-Cliente-Dialog/Resumen-Cliente-Dialog.component';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
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

export interface CopiasSeguridad {
  idCliente:string;
  fecha: Date;
  descripcion: string;
}
const ELEMENT_DATA: CopiasSeguridad[] = [
  {idCliente: "1", fecha: new Date(1991, 10, 30), descripcion: 'Copia de seguridad 98293'},
  {idCliente: "2", fecha: new Date(1991, 10, 30), descripcion: 'Copia de seguridad 98293'}

];




//creo aqui esto para ver datos inventados, luego coger los reales
interface Cuad {
  value: string;
  viewValue: string;
}

export interface infoCuad {
  ordenantes:string;
  cuenta: string;
  nif: string;
  estado:string;
}




@Component({

  selector: 'app-by-copias',
  imports: [ResumenClienteDialogComponent,FormsModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './by-copias.component.html',
  styleUrl: 'by-copias.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ByCopiasComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private _snackBar = inject(MatSnackBar);
  misignalService = inject(MiSignalService)
  cliente= this.misignalService.objetoCliente();


  textosGuiaFacil = new Map<string, string>([
    ['guia_copias', 'Desde este menú podrá gestionar las copias de seguridad de AEBWeb. Una copia de seguridad almacena todos los datos que tiene un cliente en los cuadernos SEPA. \n Solamente se permite una copia de seguridad por cliente. Si se hace una segunda copia se machaca la anterior.'],
    ['buscar_copias', 'Para encontrar una determinada copia de seguridad puede usar los campos de búsqueda por usuario o fecha y pulsar [Buscar].'],
    ['vertodas_copias', 'Para listar todas las copias almacenadas, pulse [Ver Todas]'],
    ['restaurar_copias', 'Permite restaurar la información de un usuario de AEBWeb utilizando su copia de seguridad. Antes de restaurar la información se le mostrará, a modo de confirmación, un resumen de los datos almacenados en la copia. (Importante: Toda la información del usuario de AEBWeb, en los cuadernos SEPA, se eliminará antes de cargarle los datos de la copia de seguridad).'],
    ['eliminar_copias', 'Borrará toda la información de la copia de seguridad seleccionada.'],
    ['crear_copias', 'Conducirá a una pantalla donde podrá seleccionar el usuario para el que desea crear una copia de seguridad. En dicha pantalla se mostrará , a modo de confirmación, un resumen de los datos del usuario.']


  ]);



  displayedColumns: string[] = ['idCliente', 'fecha', 'descripcion'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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

  constructor(private dialog: MatDialog) {}

  abrirDialogo() {

    //creo aqui para ver datos inventados, luego coger los reales 
  

      this.dialog.open(ResumenClienteDialogComponent, {
      //aqui pasarle el objeto cliente, por ahora datos ficticios
      width: '80%',
      height: '80%',
  });

  }
 }


