import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAppCustDataCompanyModule } from '../app-view/view-app-cust-data-company/view-app-cust-data-company.module';


const routes: Routes = [
    {
        path: '',
        children: [
          {
            path: 'CustomerDetail',
            loadChildren : '../app-view/view-app-cust-data-company/view-app-cust-data-company.module#ViewAppCustDataCompanyModule'
            
          }
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgreementViewChildRoutingModule { }
