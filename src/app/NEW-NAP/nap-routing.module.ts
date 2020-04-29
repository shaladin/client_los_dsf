import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssetDataPagingComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging.component";
import { AssetDataAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { MultiAssetDataComponent } from "./sharing-component/input-nap-component/multi-asset-data/multi-asset-data.component";

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
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class NapRoutingModule { }
