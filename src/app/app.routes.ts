import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectMonitoringComponent } from './pages/project-monitoring/project-monitoring.component';
import { ArMonitoringComponent } from './pages/ar-monitoring/ar-monitoring.component';
import { CashInComponent } from './pages/cash-in/cash-in.component';
import { FacilityAssetComponent } from './pages/facility-asset/facility-asset.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { ProjectComponent } from './pages/project/project.component';
import { ContractComponent } from './pages/contract/contract.component';
import { ItemsComponent } from './pages/items/items.component';
import { RegularCashOutComponent } from './pages/regular-cash-out/regular-cash-out.component';
import { DocumentCashOutComponent } from './pages/document-cash-out/document-cash-out.component';
import { ActionCashOutComponent } from './pages/action-cash-out/action-cash-out.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChangeFullNameComponent } from './pages/change-full-name/change-full-name.component';
import { authRedirectGuard } from './guards/auth-redirect.guard';
import { authGuard } from './guards/auth.guard';
import { AccountInformationComponent } from './pages/account-information/account-information.component';
import { UserComponent } from './pages/user/user.component';
import { BankComponent } from './pages/bank/bank.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authRedirectGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [authRedirectGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'project-monitoring',
    component: ProjectMonitoringComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ar-monitoring',
    component: ArMonitoringComponent,
    canActivate: [authGuard],
  },
  { path: 'cash-in', component: CashInComponent, canActivate: [authGuard] },
  {
    path: 'facility-asset',
    component: FacilityAssetComponent,
    canActivate: [authGuard],
  },
  { path: 'partner', component: PartnerComponent, canActivate: [authGuard] },
  { path: 'vendor', component: VendorComponent, canActivate: [authGuard] },
  { path: 'project', component: ProjectComponent, canActivate: [authGuard] },
  { path: 'contract', component: ContractComponent, canActivate: [authGuard] },
  { path: 'items', component: ItemsComponent, canActivate: [authGuard] },
  { path: 'user', component: UserComponent, canActivate: [authGuard] },
  {
    path: 'regular-cash-out',
    component: RegularCashOutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'document-cash-out',
    component: DocumentCashOutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'action-cash-out/:type/:name',
    component: ActionCashOutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'action-cash-out/:type',
    component: ActionCashOutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'account-information',
    component: AccountInformationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'change-full-name',
    component: ChangeFullNameComponent,
    canActivate: [authGuard],
  },
  {
    path: 'bank',
    component: BankComponent,
    canActivate: [authGuard],
  },
];
