import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnualComponent } from './pages/anual/anual.component';
import { ErrorComponent } from './pages/error/error.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
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
        path: 'acerca-de',
        component: AcercaDeComponent
    },
    {
        path: 'politica-privacidad',
        component: PoliticaPrivacidadComponent
    },
    {
        path: 'contacto',
        component: ContactoComponent
    },
    {
        path: '**',
        component: ErrorComponent
    }
];
