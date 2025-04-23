import { Validators, FormControl,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { merge } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login-page',

  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule,MatButtonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {

  http=inject(HttpClient);

  readonly nombre = new FormControl('', [Validators.required]);
  readonly contrasena= new FormControl('', [Validators.required]);
  
  errorMessage = signal('');
  errorMessagecontra = signal('');

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

          if (response.success) {
            alert('Login correcto');
          } else {
            alert('Usuario o contraseña incorrectos');
            
          }
        });

        console.log('sssssss');
      
    
    

 }
}
