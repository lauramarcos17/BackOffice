import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Log } from 'app/shared/interfaces/Log.interface';
import { Migracion } from 'app/shared/interfaces/Migracion.interface';
import { JsonDatoService } from 'app/shared/services/jsonDato.service';
import { MiSignalService } from 'app/shared/services/mi-signal.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-mig-masiva',
  imports: [MatLabel,MatInputModule,MatFormFieldModule,MatButtonModule],
  templateUrl: './mig-masiva.component.html',
  styleUrl: 'mig-masivo.component.css',
})
export class MigMasivaComponent {

  jsonDatoService = inject(JsonDatoService);
  misignalService = inject(MiSignalService);

  nombrerol = this.misignalService.nombrerol();

  @Input() mapa!: Map<string, string>;

  data: { col1: any; col2: any }[] = [];

  exitReader = false;

  onFileSelected(event: any): void {
      const target: DataTransfer = <DataTransfer>(event.target);

      if (target.files.length !== 1) {
        console.error('Selecciona un solo archivo');
        return;
      }


      const reader: FileReader = new FileReader();
      this.exitReader=false;

      reader.onload = (e: any) => {
        const arrayBuffer: ArrayBuffer = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });

        const firstSheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        this.data = jsonData.slice(1).map(row => ({
          col1: row[0],
          col2: row[1]
        }));

        try {
          // Procesa las migraciones de forma secuencial para evitar bucles o sobrecarga en el backend (evita el bucle de error en servidor)
          this.procesarMigracionesSecuencialmente(this.data).then(() => {

            alert('Migración finalizada');
            this.misignalService.tipoMigracion.set(1);
          }
        ).catch(err => {
            alert('Error en la migración (' + err + ')');
          });
        } catch (err) {
          alert('Error en la migración (' + err + ')');
        }
        console.log(this.data);
      };

      reader.readAsArrayBuffer(target.files[0]);
    }

    async procesarMigracionesSecuencialmente(data: { col1: any; col2: any }[]) {
      for (const { col1, col2 } of data) {
        await this.crearMigracionAsync(col1, col2);
      }
    }


    crearMigracionAsync(clienteOrigen: string, clienteDestino: string): Promise<any> {
      return new Promise((resolve, reject) => {
      this.jsonDatoService.getMigraciones(clienteDestino).subscribe({
        next: (migraciones) => {
        const existeDestino = migraciones.some(m => 
          String(m.clienteDestino).trim() === String(clienteDestino).trim()
        );
        if (existeDestino) {
          if (!confirm('Ya existe una migración con cliente destino '+clienteDestino+'. ¿Reescribir la migración con el cliente origen '+clienteOrigen+'?')) {
          // Si el usuario cancela, resolvemos sin crear la migración
          return resolve(null);
          }
        }
        // Si no existe o el usuario acepta, creamos la migración
        this.jsonDatoService.crearMigracion(clienteOrigen, clienteDestino).subscribe({
          next: (nuevaMigracion) => {
          console.log(nuevaMigracion);
          this.mandaLogBruto(nuevaMigracion, "Migración masiva realizada desde fichero");
          resolve(nuevaMigracion);
          },
          error: (err) => {
          console.error('Error creando migración', err);
          reject(err);
          }
        });
        },
        error: (err) => {
        console.error('Error obteniendo migraciones', err);
        reject(err);
        }
      });
      });
    }

    mandaLogBruto(row : Migracion, operacion:string){ //TIENE QUE RECIBIR UN LOG QUE SE GENERE EN CADA ACCIÓN
      
            const logBruto= {
                    id:0,
                    fechaInicio: row.fechaHoraInicioOperacion,
                    fechaFin: row.fechaHoraFinOperacion,
                    usuario: this.nombrerol,
                    cuaderno: 'Todos',
                    operacion: operacion,
                    descripcion: row.descripcion,
                    cliente: this.misignalService.objetoCliente()!.id.toString()
                  };

           this.jsonDatoService.crearLog(logBruto).subscribe((resp: Log) => {
            console.log(resp);
        },
     )}

 }

