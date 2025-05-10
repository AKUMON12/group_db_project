import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./components/auth/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./components/auth/register/register.module').then(m => m.RegisterModule)
    },
    {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard],
        loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
    },
    {
        path: 'student',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/student/student.module').then(m => m.StudentModule)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { } 