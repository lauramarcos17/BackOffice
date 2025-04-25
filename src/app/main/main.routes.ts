import { Routes } from "@angular/router";
import { MainPageComponent } from "./main-page/main-page.component";
import { ByAdministrarComponent } from "./by-administrar/by-administrar.component";
import { ByCopiasComponent } from "./by-copias/by-copias.component";
import { ByHistoricoComponent } from "./by-historico/by-historico.component";
import { ByLogsComponent } from "./by-logs/by-logs.component";
import { ByMigrarComponent } from "./by-migrar/by-migrar.component";


export const mainroutes: Routes = [
    {
        path:'',component: MainPageComponent,
        children:[
            {
                path:'by-administrar',
                component:ByAdministrarComponent
            },
            {
                path:'by-copias',
                component:ByCopiasComponent
            },
            {
                path:'by-historico',
                component:ByHistoricoComponent
            },
            {
                path:'by-logs',
                component:ByLogsComponent
            },
            {
                path:'by-migrar',
                component:ByMigrarComponent
            }
        ]
    }
];
export default mainroutes;