import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseTrackingViewComponent } from './purchase-tracking-view.component';

const routes: Routes = [
    {
        path: '',
        component: PurchaseTrackingViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PurchaseTrackingViewRoutingModule { }