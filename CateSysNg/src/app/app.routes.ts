import { Routes } from '@angular/router';
import { Login } from './modules/login-modules/login';
import { Aluno } from './modules/aluno-modules/aluno/aluno';
import { Professor } from './modules/professor-modules/professor/professor';
import { MenuLateral } from './shared/menu-lateral/menu-lateral';
export const routes: Routes = [

    { path: '', component: Login, pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: MenuLateral,
        children: [
            { path: 'aluno', component: Aluno },
            { path: 'professor', component: Professor }
        ]
    },

    { path: '**', redirectTo: 'login' }
];
