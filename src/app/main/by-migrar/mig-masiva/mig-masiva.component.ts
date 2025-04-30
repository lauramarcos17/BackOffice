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


 }
