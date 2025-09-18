import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guards/auth-guard';
import { childAuthGuard } from './core/auth-guards/childAuth/child-auth-guard';

export const routes: Routes = [
    {
        path:'signin',
        loadComponent:()=>import('./components/sign-in/sign-in').then(m=>m.SignIn)
    },
    {
        path:'register',
        loadComponent:()=>import('./components/register/register').then(m=>m.Register)
    },
    {
        path:'forgot-password',
        loadComponent:()=>import('./components/forgot-password/forgot-password').then(m=>m.ForgotPassword),
    },
    {
        path:'otp',
        loadComponent:()=>import('./components/otp/otp').then(m=>m.Otp),
    },
    {
        path:'',
        loadComponent:()=>import('./components/landing/landing').then(m=>m.Landing)
    },

{
    path:'question/create',
    loadComponent:()=>import('./components/question/create/create').then(m=>m.Create),
    canActivate:[childAuthGuard,authGuard]
},
{
    path:'question/update/:id',
    loadComponent:()=>import('./components/question/create/create').then(m=>m.Create),
    canActivate:[childAuthGuard,authGuard]
},
{
    path:'quiz/create',
    loadComponent:()=>import('./components/quiz/create/create').then(m=>m.Create),
    canActivate:[childAuthGuard,authGuard]
},
{
    path:'quiz/update/:id',
    loadComponent:()=>import('./components/quiz/create/create').then(m=>m.Create),
    canActivate:[childAuthGuard,authGuard]
},
{
    path:'leaderboard',
    loadComponent:()=>import('./components/leaderboard/leaderboard').then(m=>m.Leaderboard),
    canActivate:[childAuthGuard,authGuard]
},
{
    path:'quiz/score',
    loadComponent:()=>import('./components/quiz/score/score').then(m=>m.Score),
    canActivate:[childAuthGuard,authGuard]
},
{
    path:'question/all',
    loadComponent:()=>import('./components/question/list/list').then(m=>m.List),
    canActivate:[childAuthGuard,authGuard]
}
,
{
    path:'**',
    loadComponent:()=>import('./components/not-found/not-found').then(m=>m.NotFound)
}
];
