import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustExposureViewXComponent } from 'app/impl/view-enhancing/cust-exposure-view/cust-exposure-view-x.component';
import { CustExposureViewComponent } from './cust-exposure-view.component';
const routes: Routes = [
    {
        path: '',
        component: CustExposureViewComponent
    },
    {
        path: 'X',
        component: CustExposureViewXComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustExposureViewRoutingModule { }


