import { Component, inject, Input } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MiSignalService } from '../../../shared/services/mi-signal.service';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ByLogsComponent } from '../by-logs.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';



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
  imports: [MatPaginatorModule,MatTableModule, MatFormField, MatFormFieldModule, MatLabel, MatInputModule, MatIconModule, MatTooltip, MatTooltipModule, MatCardModule],
  templateUrl: './consultas-logs.component.html',
  styleUrl: 'consultas-logs.component.css'
})
export class ConsultasLogsComponent {
  misignalService = inject(MiSignalService);
  rol=this.misignalService.rol;
  displayedColumns: string[] = ['error', 'fecha', 'rol','cuaderno','accion','query'];
  dataSource = ELEMENT_DATA;

  @Input() mapa!: Map<string, string>;





 }
