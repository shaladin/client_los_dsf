import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAppCustDataCompanyComponent } from './view-app-cust-data-company.component';
const routes: Routes = [
    {
        path: '',
        component: ViewAppCustDataCompanyComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewAppCustDataCompanyRoutingModule { }


