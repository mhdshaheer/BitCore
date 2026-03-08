import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { APP_ROUTES } from './core/constants/routes';

export const routes: Routes = [
  {
    path: APP_ROUTES.AUTH.LOGIN,
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: APP_ROUTES.AUTH.REGISTER,
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: APP_ROUTES.AUTH.VERIFY,
    loadComponent: () => import('./features/auth/verify/verify.component').then(m => m.VerifyComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: APP_ROUTES.DASHBOARD,
        loadComponent: () => import('./features/url/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: APP_ROUTES.MY_URLS,
        loadComponent: () => import('./features/url/my-urls/my-urls.component').then(m => m.MyUrlsComponent)
      },
      {
        path: '',
        redirectTo: APP_ROUTES.DASHBOARD,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: APP_ROUTES.ERROR.NOT_FOUND,
    loadComponent: () => import('./features/error/error-page.component').then(m => m.ErrorPageComponent),
    data: {
      code: '404',
      title: 'Page not found',
      message: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
    }
  },
  {
    path: APP_ROUTES.ERROR.SERVER_ERROR,
    loadComponent: () => import('./features/error/error-page.component').then(m => m.ErrorPageComponent),
    data: {
      code: '500',
      title: 'Server error',
      message: "Something went wrong on our end. Please try again later or contact support if the problem persists."
    }
  },
  {
    path: 'error',
    children: [
      { path: '404', redirectTo: `/${APP_ROUTES.ERROR.NOT_FOUND}`, pathMatch: 'full' },
      { path: '500', redirectTo: `/${APP_ROUTES.ERROR.SERVER_ERROR}`, pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.ERROR.NOT_FOUND
  }
];
