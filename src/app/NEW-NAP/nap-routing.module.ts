import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewAssetDataComponent } from "./sharing-component/view-app-component/view-asset-data/view-asset-data.component";

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
        path: 'CFNA',
        loadChildren: './CFNA/input-nap.module#InputNapCFNAModule'
      },
      {
        path: 'Factoring',
        loadChildren: './FCTR/input-nap.module#InputNapFCTRModule'
      },
      {
        path: 'OPL',
        loadChildren: './ROS/input-nap.module#InputNapROSModule'
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
        path: 'Sharing',
        loadChildren: './sharing-page/sharing-page.module#SharingPageModule'
      },
      {
        path: 'ViewAsset',
        component: ViewAssetDataComponent,
        data: {
          title: 'View Asset Data'
        }
      },
      {
        path: 'MainData',
        loadChildren: './main-data/main-data.module#MainDataModule'
      },
      {
        path: 'CustCompletion',
        loadChildren: './cust-completion/cust-completion.module#CustCompletionModule'
      },
      {
        path: 'ApplicationProcess',
        loadChildren: './business-process/application-process/application-process.module#ApplicationProcessSharingModule'
      }
      // {
      //   path: 'Single',
      //   component: CollateralAddEditSingleComponent,
      //   data: {
      //     title: 'Asset Registration Form'
      //   }
      // },
      // {
      //   path: 'Collateral/Detail',
      //   component: CollateralAddEditComponent,
      //   data: {
      //     title: 'Collateral Registration Form'
      //   }
      // },
      // {
      //     path: 'AssetLeasing/Paging',
      //     component: MultiAssetLeasingComponent,
      //     data: {
      //       title: 'Asset Leasing'
      //     }
      // }    
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NapRoutingModule { }
