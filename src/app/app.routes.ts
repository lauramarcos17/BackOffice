import { Routes } from '@angular/router';
import { LoginPageComponent } from './shared/login-page/login-page.component';
import { MainPageComponent } from './main/main-page/main-page.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {path:'', component:LoginPageComponent},
    {path:'main',
        loadChildren:()=>import('./main/main.routes'),
        canActivate: [AuthGuard]
    }
    //controlar 404
];
