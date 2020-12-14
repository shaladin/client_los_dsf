import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustExposureViewComponent } from './cust-exposure-view.component';
const routes: Routes = [
    {
        path: '',
        component: CustExposureViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustExposureViewRoutingModule { }


