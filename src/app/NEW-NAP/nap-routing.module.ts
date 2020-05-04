import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssetDataPagingComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging.component";
import { AssetDataAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { LoanObjectComponent } from "./sharing-component/input-nap-component/application-data/loan-object/loan-object.component";
import { ApplicationDataComponent } from "./sharing-component/input-nap-component/application-data/application-data.component";
import { ApplicationDataRefinancingComponent } from "./sharing-component/input-nap-component/application-data/application-data-refinancing/application-data-refinancing.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'ConsumerFinance',
                loadChildren: './CF4W/input-nap.module#InputNapCF4WModule'
            },
            {
                path: 'FinanceLeasing',
                loadChildren: './FL4W/input-nap.module#InputNapFL4WModule'
            },
            {
                path: 'CF2W',
                loadChildren: './CF2W/input-nap.module#InputNapCF2WModule'
            },
            {
                path: 'CFRefinancing',
                loadChildren: './RFN4W/input-nap.module#InputNapRFN4WModule'
            },
            {
                path: 'Factoring',
                loadChildren: './FCTR/input-nap.module#InputNapFCTRModule'
            },
            {
                path: 'AdditionalProcess',
                loadChildren: './business-process/additional-process/additional-process.module#AdditionalProcessSharingModule'
            },
            {
                path: 'CreditProcess',
                loadChildren: './business-process/credit-process/credit-process.module#CreditProcessSharingModule'
            },
            {
                path: 'AdminProcess',
                loadChildren: './business-process/admin-process/admin-process.module#AdminProcessSharingModule'
            },
            {
                path: 'AddProcess',
                loadChildren: './business-process/additional-process/additional-process.module#AdditionalProcessSharingModule'
            },
            {
                path: 'View',
                loadChildren: './view/nap-view.module#NapViewModule'
            },
            {
                path: 'AssetData/Paging',
                component: AssetDataPagingComponent,
                data: {
                  title: 'Asset Registration Summary'
                }
            },
            {
              path: 'AssetData/Detail',
              component: AssetDataAddEditComponent,
              data: {
                title: 'Asset Registration Form'
              }
            },
            {
              path: 'Collateral/Detail',
              component: CollateralAddEditComponent,
              data: {
                title: 'Collateral Registration Form'
              }
            },
            {
                path: 'LoanObject',
                component: LoanObjectComponent,
                data: {
                  title: 'Loan Object'
                }
            },
            {
                path: 'ApplicationDataRefinancing',
                component: ApplicationDataRefinancingComponent,
                data: {
                  title: 'Loan Object'
                }
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NapRoutingModule { }
