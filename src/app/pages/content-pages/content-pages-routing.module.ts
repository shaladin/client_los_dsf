import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";
import { CustomerSelfVerificationComponent } from './external-page/customer-self-verification/customer-self-verification.component';
import { PagesComponent } from './pages/pages.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestNewPasswordComponent } from './request-new-password/request-new-password.component';
 

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'content',
        component: PagesComponent,
        data: {
          title: 'Pages'
        }
      },
      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'SelfVerification',
        component: CustomerSelfVerificationComponent,
        data: {
          title: 'Lead Customer Self Verification'
        }
      },
      {
        path: 'RequestPassword',
        component: RequestNewPasswordComponent,
        data: {
          title: 'Request New Password Page'
        }
      },
      {
        path: 'ResetPassword/:code',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password Page'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
