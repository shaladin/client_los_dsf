import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewAssetDataComponent } from "./sharing-component/view-app-component/view-asset-data/view-asset-data.component";
import { PathConstant } from "app/shared/constant/PathConstant";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.NAP_CF4W,
        loadChildren: './CF4W/input-nap.module#InputNapCF4WModule'
      },
      {
        path: PathConstant.NAP_FL4W,
        loadChildren: './FL4W/input-nap.module#InputNapFL4WModule'
      },
      {
        path: PathConstant.NAP_CF2W,
        loadChildren: './CF2W/input-nap.module#InputNapCF2WModule'
      },
      {
        path: PathConstant.NAP_CFRFN4W,
        loadChildren: './RFN4W/input-nap.module#InputNapRFN4WModule'
      },
      {
        path: PathConstant.NAP_CFNA,
        loadChildren: './CFNA/input-nap.module#InputNapCFNAModule'
      },
      {
        path: PathConstant.NAP_FCTR,
        loadChildren: './FCTR/input-nap.module#InputNapFCTRModule'
      },
      {
        path: PathConstant.NAP_OPL,
        loadChildren: './ROS/input-nap.module#InputNapROSModule'
      },
      {
        path: PathConstant.NAP_ADDTNL_PRCS,
        loadChildren: './business-process/additional-process/additional-process.module#AdditionalProcessSharingModule'
      },
      {
        path: PathConstant.NAP_CRD_PRCS,
        loadChildren: './business-process/credit-process/credit-process.module#CreditProcessSharingModule'
      },
      {
        path: PathConstant.NAP_ADM_PRCS,
        loadChildren: './business-process/admin-process/admin-process.module#AdminProcessSharingModule'
      },
      {
        path: PathConstant.NAP_ADD_PRCS,
        loadChildren: './business-process/additional-process/additional-process.module#AdditionalProcessSharingModule'
      },
      {
        path: PathConstant.NAP_VIEW,
        loadChildren: './view/nap-view.module#NapViewModule'
      },
      {
        path: PathConstant.NAP_SHARING,
        loadChildren: './sharing-page/sharing-page.module#SharingPageModule'
      },
      {
        path: PathConstant.NAP_VIEW_ASSET,
        component: ViewAssetDataComponent,
        data: {
          title: 'View Asset Data'
        }
      },
      {
        path: PathConstant.NAP_MAIN_DATA,
        loadChildren: './main-data/main-data.module#MainDataModule'
      },
      {
        path: PathConstant.NAP_CUST_COMPL,
        loadChildren: './cust-completion/cust-completion.module#CustCompletionModule'
      },
      {
        path: PathConstant.NAP_APP_PRCS,
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
