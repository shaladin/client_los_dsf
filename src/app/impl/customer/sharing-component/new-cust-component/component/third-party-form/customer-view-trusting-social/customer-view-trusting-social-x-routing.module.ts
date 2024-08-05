import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerViewTrustingSocialXComponent } from './customer-view-trusting-social-x.component';
const routes: Routes = [
    {
        path: '',
        component: CustomerViewTrustingSocialXComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerViewTrustingSocialXRoutingModule { }


