import { ConsultasLogsComponent } from './consultas-logs/consultas-logs.component';
import {  Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';



interface Food {
  value: string;
  viewValue: string;
}


@Component({

  selector: 'app-by-logs',
  imports: [ConsultasLogsComponent,FormsModule,MatSelectModule,MatCheckboxModule, MatFormFieldModule, MatInputModule, MatDividerModule,  MatButton, MatButtonModule],
  templateUrl: './by-logs.component.html',
  styleUrl: 'by-logs.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ByLogsComponent {

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];



 }


