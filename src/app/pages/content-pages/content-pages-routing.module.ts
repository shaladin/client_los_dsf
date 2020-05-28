import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";
import { CustomerSelfVerificationComponent } from './external-page/customer-self-verification/customer-self-verification.component';
 

const routes: Routes = [
  {
    path: '',
    children: [
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
      } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
