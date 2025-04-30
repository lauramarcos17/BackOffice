import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mig-manual',
  imports: [MatLabel,MatFormField,MatInputModule,MatFormFieldModule,MatButtonModule],
  templateUrl: './mig-manual.component.html',
  styleUrl: 'mig-manual.component.css',
})
export class MigManualComponent {

 }
