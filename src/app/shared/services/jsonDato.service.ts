import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClienteJsonInterface } from '../interfaces/ClienteJson.interface';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})


export class JsonDatoService {

  private http = inject(HttpClient)

  private apiUrl = 'http://localhost:8080/api'; // URL base del backend Spring Boot

  buscarPorCliente(idCliente: string): Observable<string> {
    // Realiza una solicitud GET al endpoint /api/clientes con el parámetro id
    return this.http.get<string>(`${this.apiUrl}/clientes`, {
      params: { id: idCliente.toString() }, // Pasa el parámetro id como query param
      withCredentials: true, // Incluye cookies o credenciales si es necesario
    });
  }

}
