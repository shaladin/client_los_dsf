import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";
import { CustomerSelfVerificationComponent } from './external-page/customer-self-verification/customer-self-verification.component';
import { PagesComponent } from './pages/pages.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestNewPasswordComponent } from './request-new-password/request-new-password.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { ChangePasswordComponent } from './change-password/change-password.component';
 

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.CONTENT_PAGE,
        component: PagesComponent,
        data: {
          title: 'Pages'
        }
      },
      {
        path: PathConstant.CONTENT_PAGE_LOGIN,
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: PathConstant.CONTENT_PAGE_SELF_VERIF,
        component: CustomerSelfVerificationComponent,
        data: {
          title: 'Lead Customer Self Verification'
        }
      },
      {
        path: PathConstant.CONTENT_PAGE_REQ_PASSWORD,
        component: RequestNewPasswordComponent,
        data: {
          title: 'Request New Password Page'
        }
      },
      {
        path: PathConstant.CONTENT_PAGE_RESET_PASSWORD,
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password Page'
        }
      },
      {
        path: PathConstant.CONTENT_PAGE_CHANGE_PASSWORD,
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password Page'
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
