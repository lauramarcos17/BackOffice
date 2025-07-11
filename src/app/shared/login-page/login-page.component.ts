import { Validators, FormControl,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { merge } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MainPageComponent } from "../../main/main-page/main-page.component";
import { MiSignalService } from '../services/mi-signal.service';



@Component({
  selector: 'app-login-page',

  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {

  http=inject(HttpClient);
  router = inject(Router);
  misignalService=inject(MiSignalService);

  readonly nombre = new FormControl('', [Validators.required]);
  readonly contrasena= new FormControl('', [Validators.required]);

  errorMessage = signal('');
  errorMessagecontra = signal('');
  errorMessageFinal = signal('');
  rol = signal('');
  nombreusuario = signal<string >('');
  nombreRol=signal<string >('');



  constructor() {
    merge(this.nombre.statusChanges, this.nombre.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.nombre.hasError('required')) {
      this.errorMessage.set('Debes introducir un usuario');
     }
     else{
      this.errorMessage.set('');
    }

     if(this.contrasena.invalid){
        this.errorMessagecontra.set('Debes introducir una contraseña');
      }
      else{
        this.errorMessagecontra.set('');
      }

    }



  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
  this.nombre.markAsTouched();
  this.contrasena.markAsTouched();
  this.updateErrorMessage();

  this.http.post('http://localhost:8080/api/login', {
    nombre: this.nombre.value,
    contrasena: this.contrasena.value
  }).subscribe((response: any) => {
    this.errorMessageFinal.set(response.errorMsg);

    if (response.success) {
      this.rol.set(response.rol);
      this.nombreRol.set(response.rolnombre);

      if(this.nombreusuario !==null) {
        this.nombreusuario.set(this.nombre.value ?? '' );
      }

      // Guarda el token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      this.misignalService.setMensaje(this.nombreusuario());
      this.misignalService.setNumRol(Number(this.rol()));
      this.misignalService.setNombrerol(this.nombreRol());
      this.router.navigate(['/main']);
    }
  });
}
}
