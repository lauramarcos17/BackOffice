import { Routes } from '@angular/router';
import { LoginPageComponent } from './shared/login-page/login-page.component';
import { MainPageComponent } from './main/main-page/main-page.component';

export const routes: Routes = [
    {path:'', component:LoginPageComponent},
    {path:'main', 
        loadChildren:()=>import('./main/main.routes')
    }
];
