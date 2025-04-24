import { Routes } from '@angular/router';
import { LoginPageComponent } from './shared/login-page/login-page.component';
import { MainPageComponent } from './shared/main-page/main-page.component';

export const routes: Routes = [
    {path:'', component:LoginPageComponent},
    {path:'main', component: MainPageComponent}
];
