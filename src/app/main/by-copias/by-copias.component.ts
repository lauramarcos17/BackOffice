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

export interface CopiasSeguridad {
  usuario:number;
  fecha: Date;
  descripcion: string;
}
const ELEMENT_DATA: CopiasSeguridad[] = [
  {usuario: 1, fecha: new Date(1991, 10, 30), descripcion: 'Copia de seguridad 98293'},
  {usuario: 2, fecha: new Date(1991, 10, 30), descripcion: 'Copia de seguridad 98293'}

];

@Component({

  selector: 'app-by-copias',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatDatepickerModule, MatButton, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule],
  templateUrl: './by-copias.component.html',
  styleUrl: 'by-copias.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ByCopiasComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['usuario', 'fecha', 'descripcion'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

 }


