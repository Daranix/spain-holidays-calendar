import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnualComponent } from './pages/anual/anual.component';
import { MesComponent } from './pages/mes/mes.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'festivos/:provincia/:year',
        component: AnualComponent
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
