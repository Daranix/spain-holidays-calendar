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
        path: 'politica-cookies',
        loadComponent: () => import('./pages/politica-cookies/politica-cookies.component').then(m => m.PoliticaCookiesComponent)
    },
    {
        path: 'terminos-condiciones',
        loadComponent: () => import('./pages/terminos-condiciones/terminos-condiciones.component').then(m => m.TerminosCondicionesComponent)
    },
    {
        path: 'contacto',
        component: ContactoComponent
    },
    {
        path: 'blog',
        loadComponent: () => import('./pages/blog-list/blog-list.component').then(m => m.BlogListComponent)
    },
    {
        path: 'blog/:slug',
        loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent)
    },
    {
        path: 'desarrolladores',
        loadComponent: () => import('./pages/developers/developers.component').then(m => m.DevelopersComponent)
    },
    {
        path: 'calculadora-puentes',
        loadComponent: () => import('./pages/calculadora-puentes/calculadora-puentes.component').then(m => m.CalculadoraPuentesComponent)
    },
    {
        path: '**',
        component: ErrorComponent
    }
];
