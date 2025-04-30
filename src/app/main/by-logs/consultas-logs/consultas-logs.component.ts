import { Component } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

export interface Log{
  error:number;
  fecha: Date;
  rol:number;
  cuaderno: string;
  accion: string;
  query: string;
}
const ELEMENT_DATA: Log[] = [
  {error: 1, fecha: new Date(1991, 10, 30), rol:3,cuaderno :'34SEPA',accion:'Lista ordenantes', query: 'update 98293'},
  
];


@Component({
  selector: 'app-consultas-logs',
  imports: [MatPaginatorModule,MatTableModule],
  templateUrl: './consultas-logs.component.html',
})
export class ConsultasLogsComponent {
 
  displayedColumns: string[] = ['error', 'fecha', 'rol','cuaderno','accion','query'];
  dataSource = ELEMENT_DATA;



 }
