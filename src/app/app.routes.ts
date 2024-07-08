import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnualComponent } from './pages/anual/anual.component';
import { MesComponent } from './pages/mes/mes.component';
import { ErrorComponent } from './pages/error/error.component';
import { existsProvinciaGuard } from './guards/exists-provincia.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'festivos/:provincia/:year',
        component: AnualComponent,
        canActivate: [existsProvinciaGuard]
    },
    {
        path: 'festivos/:provincia/:year/:month',
        component: MesComponent
    },
    {
        path: '**',
        component: ErrorComponent
    }
];
