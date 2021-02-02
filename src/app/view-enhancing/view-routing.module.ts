import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'AppView',
                loadChildren: './app-view/app-view.module#AppViewModule'
            },
            {
                path: 'AgrmntView',
                loadChildren: './agr-view/agr-view.module#AgrViewModule'
            },
            {
                path: 'POView',
                loadChildren: './purchase-order-view/purchase-order-view.module#POViewModule'
            },
            {
                path: 'Lead',
                loadChildren: './lead-view/lead-view.module#LeadViewModule'
            },
            {
                path: 'Mou/CustView',
                loadChildren: './mou-view/mou-view.module#MouViewModule'
            },
            {
                path: 'SurveyView',
                loadChildren: './survey-view-prototype/survey-view.module#SurveyViewModule'
            },
            {
                path: 'CustExposureView',
                loadChildren: './cust-exposure-view/cust-exposure-view.module#CustExposureViewModule'
            },
            {
                path: 'PhoneVerifView',
                loadChildren: './phone-verif/phone-verif-view.module#PhoneVerifViewModule'
            },
            {
                path: 'PurchaseTracking',
                loadChildren: './purchase-tracking-view/purchase-tracking-view.module#PurchaseTrackingViewModule'
            },
            {
                path: 'AppAsset',
                loadChildren: './app-asset-view/app-asset-view.module#AppAssetViewModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewRoutingModule { }
