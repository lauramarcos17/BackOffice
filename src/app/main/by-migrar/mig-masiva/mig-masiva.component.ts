import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mig-masiva',
  imports: [MatLabel,MatFormField,MatInputModule,MatFormFieldModule,MatButtonModule],
  templateUrl: './mig-masiva.component.html',
  styleUrl: 'mig-masivo.component.css',
})
export class MigMasivaComponent {
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
      // Aquí puedes procesar el archivo
    }
  }

 }
