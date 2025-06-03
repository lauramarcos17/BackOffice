import { JsonDatoService } from 'app/shared/services/jsonDato.service';

import { Component, effect, inject, Input, signal, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MiSignalService } from '../../../shared/services/mi-signal.service';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ByLogsComponent } from '../by-logs.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Log } from 'app/shared/interfaces/Log.interface';




const ELEMENT_DATA: Log[] = [

];


@Component({
  selector: 'app-consultas-logs',
  imports: [MatPaginatorModule,MatTableModule, MatSortModule , MatFormFieldModule, MatInputModule, MatIconModule, MatTooltip, MatTooltipModule, MatCardModule],
  templateUrl: './consultas-logs.component.html',
  styleUrl: 'consultas-logs.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ConsultasLogsComponent {
  misignalService = inject(MiSignalService);
  jsonDatoService=inject(JsonDatoService);
  rol=this.misignalService.rol;

  displayedColumns: string[] = ['id','fechaInicio','fechaFin','usuario','operacion','cuaderno','cliente'];
  dataSource = new MatTableDataSource<Log>(ELEMENT_DATA);

  private _liveAnnouncer = inject(LiveAnnouncer);
  logs = signal<Log[]>([]);




  @Input() mapa!: Map<string, string>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    // Personaliza el ordenamiento para las fechas
    this.dataSource.sortingDataAccessor = (item:any, property:any) => {
      if (property === 'fechaInicio' || property === 'fechaFin') {
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



   announceSortChange(sortState: Sort) {
   //para ordenar columnas de la tabla
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  constructor() {
    effect(() => {
      const actualizar = this.misignalService.actualizarBackup();
      const cliente = this.misignalService.objetoCliente();
      const onTabChange = this.misignalService.selectedTab(); //Esta señal se actualiza con cada cambio de pestaña

      if (cliente && cliente.id !== undefined && cliente.id !== null) {
         this.cargarLogs();
         this.misignalService.actualizarBackup.set(false);

      }

      //para detectar cada vez que creo una copia


    });


  }
  cargarLogs() {

    const clienteobjeto = this.misignalService.objetoCliente();
    const cliente = clienteobjeto?.id?.toString() ?? '';

    console.log('Cliente ID usado para buscar logs:', cliente);
    this.jsonDatoService.getLogs(cliente).subscribe({
      next: (resp) => {
       this.logs.set(resp);
       console.log("hola");
       console.log(resp);
       // Aquí se rellena la tabla asignando los datos recibidos al dataSource
       this.dataSource.data = resp;

      },
      error: (err) => {
       console.error('Error cargando logs', err);
      }
    });
   }


 }
