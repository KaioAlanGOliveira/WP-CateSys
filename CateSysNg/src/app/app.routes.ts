import { Routes } from '@angular/router';
import { Login } from './modules/login/login';
import { Aluno } from './modules/aluno/aluno';
import { MenuLateral } from './shared/menu-lateral/menu-lateral';
export const routes: Routes = [

    { path: '', component: Login },

    {
        path: '',
        component: MenuLateral,
        children: [
            { path: 'login', component: Login },
            { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redireciona a página inicial para o login
            { path: 'aluno', component: Aluno }
            // { path: 'inicio', component: InicioComponent },
            // { path: 'professor', component: Professor },
            // { path: '', redirectTo: 'inicio', pathMatch: 'full' }
        ]
    },

    // Rota de fuga se o link não existir
    { path: '**', redirectTo: 'login' }
];
