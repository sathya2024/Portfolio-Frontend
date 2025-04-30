import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HoldingsComponent } from './features/holdings-page/holdings/holdings.component';
import { TransactionsComponent } from './features/Transaction-page/transactions/transactions.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RecenttransactionComponent } from './features/Transaction-page/recenttransaction/recenttransaction.component';
import { HomeComponent } from './features/home/home.component';
export const routes: Routes = [
  { path: '',component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'holdings',
    component: HoldingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login' },
];
