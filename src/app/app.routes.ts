import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guards/auth-guard';
import { childAuthGuard } from './core/auth-guards/childAuth/child-auth-guard';
import { roleGuard } from './core/auth-guards/role-guard';

export const routes: Routes = [
    {
        path: 'signin',
        loadComponent: () => import('./components/sign-in/sign-in').then(m => m.SignIn),
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register').then(m => m.Register),
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password').then(m => m.ForgotPassword),
    },
    {
        path: 'otp',
        loadComponent: () => import('./components/otp/otp').then(m => m.Otp),
    },
    {
        path: 'new-password',
        loadComponent: () => import('./components/new-password/new-password').then(m => m.NewPassword),
    },
    {
        path: '',
        loadComponent: () => import('./components/landing/landing').then(m => m.Landing)
    },

    {
        path: 'user-dashboard',
        loadComponent: () => import('./components/user-dashboard/user-dashboard').then(m => m.UserDashboard),
    },
    // {
    //     path:'user/attempts',
    //     loadComponent:()=>import('./components/user-attempts/user-attempts').then(m=>m.UserAttempts),
    //     canActivate:[authGuard, roleGuard],
    //     data:{role:'USER'}
    // },
    {
        path: 'explore/category/:subject',
        loadComponent: () => import('./components/user-category-list/user-category-list').then(m => m.UserCategoryList),
    },
    {
        path: 'user/explore',
        loadComponent: () => import('./components/user-explore/user-explore').then(m => m.UserExplore),
    },
    {
        path: 'user/practice',
        loadComponent: () => import('./components/user-practice/user-practice').then(m => m.UserPractice),
    },
    {
        path: 'student-dashboard',
        loadComponent: () => import('./components/student-instructor-dashboard/student-instructor-dashboard').then(m => m.StudentInstructorDashboard),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    },
    {
        path: 'question/create',
        loadComponent: () => import('./components/question/create/create').then(m => m.Create),
    },
    {
        path: 'question/update/:id',
        loadComponent: () => import('./components/question/create/create').then(m => m.Create),
    },
    {
        path: 'quiz/create',
        loadComponent: () => import('./components/quiz/create/create').then(m => m.Create),
    },
    {
        path: 'quiz/update/:id',
        loadComponent: () => import('./components/quiz/create/create').then(m => m.Create),
    },
    {
        path: 'leaderboard',
        loadComponent: () => import('./components/leaderboard/leaderboard').then(m => m.Leaderboard),
    },
    {
        path: 'quiz/score',
        loadComponent: () => import('./components/quiz/score/score').then(m => m.Score),
    },
    {
        path: 'quiz/attempt/:id',
        loadComponent: () => import('./components/quiz-attempt/quiz-attempt').then(m => m.QuizAttempt),
    },
    {
        path: 'quiz/result/:id',
        loadComponent: () => import('./components/quiz-result/quiz-result').then(m => m.QuizResult),
    },
    {
        path: 'question/all',
        loadComponent: () => import('./components/question/list/list').then(m => m.List),
    },
    {
        path: 'instructor/batches',
        loadComponent: () => import('./components/batches/batches').then(m => m.Batches),
    },
    {
        path: 'instructor/quizzes',
        loadComponent: () => import('./components/instructor-quizzes/instructor-quizzes').then(m => m.InstructorQuizzes),
    },
    {
        path: 'instructor/students',
        loadComponent: () => import('./components/instructor-students/instructor-students').then(m => m.InstructorStudents),
    },
    {
        path: 'student/join',
        loadComponent: () => import('./components/student-join/student-join').then(m => m.StudentJoin),
    },
    {
        path: 'batch/:batchId/results',
        loadComponent: () => import('./components/batch-results/batch-results').then(m => m.BatchResults),
    },
    {
        path: 'student/batches',
        loadComponent: () => import('./components/student-batches/student-batches').then(m => m.StudentBatches),
    },
    {
        path: 'attempts',
        loadComponent: () => import('./components/student-attempts/student-attempts').then(m => m.StudentAttempts),
    },
    {
        path: 'select-role',
        loadComponent: () => import('./components/select-role/select-role').then(m => m.SelectRole),
    },
    {
        path: 'student/quizzes',
        loadComponent: () => import('./components/student-quizzes/student-quizzes').then(m => m.StudentQuizzes),
    },
    {
        path: 'batch/:batchId/quizzes',
        loadComponent: () => import('./components/batch-quizzes/batch-quizzes').then(m => m.BatchQuizzes),
    },
    {
        path: 'batch/:batchId/detail',
        loadComponent: () => import('./components/batch-detail/batch-detail').then(m => m.BatchDetail),
    },
    {
        path: 'settings',
        loadComponent: () => import('./components/common/settings/settings').then(m => m.Settings),
    },
    {
        path: 'features',
        loadComponent: () => import('./components/features/features').then(m => m.Features)
    },
    {
        path: 'about',
        loadComponent: () => import('./components/about/about').then(m => m.About)
    },
    {
        path: 'privacy',
        loadComponent: () => import('./components/privacy/privacy').then(m => m.Privacy)
    },
    {
        path: 'contact',
        loadComponent: () => import('./components/contact/contact').then(m => m.Contact)
    },
    {
        path: 'pricing',
        loadComponent: () => import('./components/pricing/pricing').then(m => m.Pricing)
    },
    {
        path: '**',
        loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound)
    }
];
