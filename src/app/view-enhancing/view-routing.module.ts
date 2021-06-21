import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: PathConstant.VIEW_APP,
                loadChildren: './app-view/app-view.module#AppViewModule'
            },
            {
                path: PathConstant.VIEW_AGRMNT,
                loadChildren: './agr-view/agr-view.module#AgrViewModule'
            },
            {
                path: PathConstant.VIEW_PO,
                loadChildren: './purchase-order-view/purchase-order-view.module#POViewModule'
            },
            {
                path: PathConstant.VIEW_LEAD,
                loadChildren: './lead-view/lead-view.module#LeadViewModule'
            },
            {
                path: PathConstant.VIEW_MOU_CUST,
                loadChildren: './mou-view/mou-view.module#MouViewModule'
            },
            {
                path: PathConstant.VIEW_SRVY,
                loadChildren: './survey-view-prototype/survey-view.module#SurveyViewModule'
            },
            {
                path: PathConstant.VIEW_CUST_EXPSR,
                loadChildren: './cust-exposure-view/cust-exposure-view.module#CustExposureViewModule'
            },
            {
                path: PathConstant.VIEW_PHN_VERIF,
                loadChildren: './phone-verif/phone-verif-view.module#PhoneVerifViewModule'
            },
            {
                path: PathConstant.VIEW_PURCHASE_TRACKING,
                loadChildren: './purchase-tracking-view/purchase-tracking-view.module#PurchaseTrackingViewModule'
            },
            {
                path: PathConstant.VIEW_APP_ASSET,
                loadChildren: './app-asset-view/app-asset-view.module#AppAssetViewModule'
            },
            {
                path: PathConstant.VIEW_OFFERING,
                loadChildren: './prod-offering-view/prod-offering-view.module#ProdOfferingViewModule'
            },
            {
                path: PathConstant.VIEW_PRODUCT_HO,
                loadChildren: './prod-ho-view/prod-ho-view.module#ProdHoViewModule'
            },
            {
                path: PathConstant.VIEW_APP_LIST,
                loadChildren: './app-list-view/app-list-view.module#AppListViewModule'
            },
            {
                path: PathConstant.VIEW_CHANGE_MOU,
                loadChildren: './change-mou-view/change-mou-view.module#ChangeMouViewModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewRoutingModule { }
