import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClienteJsonInterface } from '../interfaces/ClienteJson.interface';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { CopiaSeguridadJson } from '../interfaces/CopiaSeguridadJson.interface';
import { Backup } from '../interfaces/Backup.interface';





@Injectable({
  providedIn: 'root'
})


export class JsonDatoService {

  private http = inject(HttpClient)

  private apiUrl = 'http://localhost:8080/api'; // URL base del backend Spring Boot


  buscarPorCliente(idCliente: string): Observable<ClienteJsonInterface> {
    // Realizamos una solicitud GET al endpoint /api/clientes con el parámetro id
    return this.http.get(`${this.apiUrl}/clientes`, {
      params: { id: idCliente.toString() }, // Pasa el parámetro id como query param
      withCredentials: true,
       responseType: 'text'
       // Incluye cookies o credenciales si es necesario
    }).pipe(

      timeout(3000),//tiempo para que saque el alert si hay error de conexión
      map(res => JSON.parse(res) as ClienteJsonInterface), // Parseamos manualmente
      catchError(error => {console.error("error de conexion al servidor ", error);
        alert("Error de conexion al servidor. Vuelve a intentarlo en unos minutos.");
        return throwError(()=>new Error ("No se pudo conectar al serv"))})

    );
  }

  crearCopiaSeguridad(idCliente: String):Observable<CopiaSeguridadJson>{
     return this.http.get<CopiaSeguridadJson>(`${this.apiUrl}/generarCopiaSeguridad`, {
      params: { id: idCliente.toString() }, // Pasa el parámetro id como query param
      withCredentials: true,

       // Incluye cookies o credenciales si es necesario
    }).pipe(

      timeout(3000),//tiempo para que saque el alert si hay error de conexión
      //map(res => JSON.parse(res) as ClienteJsonInterface), // Parseamos manualmente
      catchError(error => {console.error("error de conexion al servidor ", error);
        //alert("Error de conexion al servidor. Vuelve a intentarlo en unos minutos.");
        return throwError(()=>new Error ("No se pudo conectar al serv"))})

    );
  }
    getBackups(): Observable<Backup[]> {
    return this.http.get<Backup[]>('http://localhost:8080/api/backups', { 
       // Pasa el parámetro id como query param
      withCredentials: true,

       // Incluye cookies o credenciales si es necesario
    });
  }
  

}
