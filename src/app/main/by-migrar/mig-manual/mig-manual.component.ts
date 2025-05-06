import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';


export interface Manual{
  Idoperacion:number;
  fechaOperacion: Date;
  UsuariOrigen:number;
  UsuarioDestino:number;
  resultado: string;
  descripcion: string;
}
const ELEMENT_DATA: Manual[] = [
  { Idoperacion: 1, fechaOperacion: new Date(1991, 10, 30), UsuariOrigen:3,UsuarioDestino:1,resultado :'Realizada',descripcion:'La migración se ha realizado con exito'},
  
];

@Component({
  selector: 'app-mig-manual',
  imports: [MatLabel,MatFormField,MatInputModule,MatFormFieldModule,MatButtonModule, MatTooltipModule,MatTableModule],
  templateUrl: './mig-manual.component.html',
  styleUrl: 'mig-manual.component.css',
})
export class MigManualComponent {

  @Input() mapa!: Map<string, string>;
  displayedColumns: string[] = ['Idoperacion', 'fechaOperacion','UsuariOrigen', 'UsuarioDestino','resultado','descripcion'];
  dataSource = ELEMENT_DATA;

 }
