import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClienteJsonInterface } from '../interfaces/ClienteJson.interface';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { CopiaSeguridadJson } from '../interfaces/CopiaSeguridadJson.interface';
import { Backup } from '../interfaces/Backup.interface';
import { Migracion } from '../interfaces/Migracion.interface';
import { Log } from '../interfaces/Log.interface';





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

  crearCopiaSeguridad(idCliente: String, descripcionCopia:String):Observable<CopiaSeguridadJson>{
     return this.http.get<CopiaSeguridadJson>(`${this.apiUrl}/generarCopiaSeguridad`, {
      params: { id: idCliente.toString(),descripcionCopia:descripcionCopia.toString() }, // Pasa el parámetro id como query param
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
    getBackups(cliente:string): Observable<Backup[]> {
    return this.http.get<Backup[]>('http://localhost:8080/api/backups', {
       // Pasa el parámetro id como query param
         params: { cliente },
      withCredentials: true,

       // Incluye cookies o credenciales si es necesario
    });
  }

  eliminarCopia(cliente: string, fechaHora: string) {
    return this.http.delete(`${this.apiUrl}/eliminarCopia`, {
      params: { cliente, fechaHora },
      responseType: 'text'
    });
  }

   restaurarCopiaSeguridad(idCliente: String):Observable<CopiaSeguridadJson>{
     return this.http.get<CopiaSeguridadJson>(`${this.apiUrl}/restaurarCopia`, {
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

   crearMigracion(clienteOrigen: String, clienteDestino:String):Observable<Migracion>{
     return this.http.get<Migracion>(`${this.apiUrl}/generarMigracion`, {
      params: { clienteOrigen: clienteOrigen.toString() ,clienteDestino: clienteDestino.toString()},
      // Pasa el parámetro id como query param
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
  getMigraciones(idCliente: string): Observable<Migracion[]> {
    return this.http.get<Migracion[]>(`${this.apiUrl}/migraciones`,{
      params: { idCliente },
      withCredentials: true,
    });
  }

  eliminarMigracion(id: number) {
    return this.http.delete(`${this.apiUrl}/eliminarMigracion`, {
      params: { id },
      responseType: 'text'
    });
  }



  restaurarMigracion(clienteOrigen: string, clienteDestino: string, id: string): Observable<Migracion> {
    return this.http.post<Migracion>(
      `${this.apiUrl}/restaurarMigracion`,
      { id }, // Request body
      {
        params: { clienteOrigen: clienteOrigen.toString(), clienteDestino: clienteDestino.toString() },
        withCredentials: true,
      }
    ).pipe(
      timeout(3000),
      catchError(error => {
        console.error("error de conexion al servidor ", error);
        return throwError(() => new Error("No se pudo conectar al serv"));
      })
    );
  }


  crearLog(log: Log): Observable<Log> {
    return this.http.post<Log>(`${this.apiUrl}/generarLog`, log, {
      withCredentials: true,
      // Incluye cookies o credenciales si es necesario
    }).pipe(
      timeout(3000), // tiempo para que saque el alert si hay error de conexión
      catchError(error => {
        console.error("error de conexion al servidor ", error);
        //alert("Error de conexion al servidor. Vuelve a intentarlo en unos minutos.");
        return throwError(() => new Error("No se pudo conectar al serv"));
      })
    );
  }

   getLogs(cliente:string): Observable<Log[]> {
    return this.http.get<Log[]>('http://localhost:8080/api/logs', {
       // Pasa el parámetro id como query param
         params: { cliente },
      withCredentials: true,

       // Incluye cookies o credenciales si es necesario
    });
  }
}
