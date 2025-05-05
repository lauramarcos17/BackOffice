import { Component, inject } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MiSignalService } from '../../../shared/services/mi-signal.service';

export interface Log{
  error:number;
  fecha: Date;
  rol:number;
  cuaderno: string;
  accion: string;
  query: string;
}
const ELEMENT_DATA: Log[] = [
  {error: 1, fecha: new Date(1991, 10, 30), rol:3,cuaderno :'34SEPA',accion:'Listar ordenantes', query: 'update 34293'},
  {error: 2, fecha: new Date(1991, 10, 30), rol:2,cuaderno :'34SEPA',accion:'Listar ordenantes', query: 'update 976693'},
  {error: 3, fecha: new Date(1998, 10, 30), rol:1,cuaderno :'34SEPA',accion:'Listar ordenantes', query: 'update 98293'},

];


@Component({
  selector: 'app-consultas-logs',
  imports: [MatPaginatorModule,MatTableModule],
  templateUrl: './consultas-logs.component.html',
})
export class ConsultasLogsComponent {
  misignalService = inject(MiSignalService);
  rol=this.misignalService.rol;
  displayedColumns: string[] = ['error', 'fecha', 'rol','cuaderno','accion','query'];
  dataSource = ELEMENT_DATA;





 }
