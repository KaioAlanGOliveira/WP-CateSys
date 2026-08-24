import { Routes } from '@angular/router';
import { Login } from './modules/login-modules/login';
import { Aluno } from './modules/aluno-modules/aluno/aluno';
import { Professor } from './modules/professor-modules/professor/professor';
import { MenuLateral } from './shared/menu-lateral/menu-lateral';
import { Turma } from './modules/turma-modules/turma/turma';
import { Aula } from './modules/aula-modules/aula/aula';
export const routes: Routes = [

    { path: '', component: Login, pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: MenuLateral,
        children: [
            { path: 'aluno', component: Aluno },
            { path: 'professor', component: Professor },
            { path: 'turma', component: Turma },
            { path: 'aula', component: Aula }
        ]
    },

    { path: '**', redirectTo: 'login' }
];
