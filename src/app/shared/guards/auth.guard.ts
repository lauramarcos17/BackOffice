import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MiSignalService } from '../services/mi-signal.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private miSignalService: MiSignalService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!this.miSignalService.mensaje(); // Verifica si hay un usuario logueado
    if (!isAuthenticated) {
      this.router.navigate(['/']); // Redirige al login si no está autenticado
      return false;
    }
    return true;
  }


}
