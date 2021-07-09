import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PathConstant } from "app/shared/constant/PathConstant";
import { PathConstantDsf } from "app/shared/constant/PathConstantDsf";
import { CustMainDataAddDsfComponent } from "../DSF/main-data-dsf/cust-main-data-dsf/cust-main-data-add-dsf/cust-main-data-add-dsf.component";
import { CustMainDataPagingDsfComponent } from "../DSF/main-data-dsf/cust-main-data-dsf/cust-main-data-paging-dsf/cust-main-data-paging-dsf.component";
import { NapDetailPagingDsfComponent } from "../DSF/main-data-dsf/nap-detail-dsf/nap-detail-paging-dsf/nap-detail-paging-dsf.component";
import { CustMainDataAddComponent } from "./cust-main-data/cust-main-data-add/cust-main-data-add.component";
import { CustMainDataPagingComponent } from "./cust-main-data/cust-main-data-paging/cust-main-data-paging.component";
import { NapDetailPagingComponent } from "./nap-detail/nap-detail-paging/nap-detail-paging.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.NAP1_PAGING,
        component: CustMainDataPagingComponent,
        data: {
          title: 'Cust Main Data Paging'
        }
      },
      {
        path: PathConstantDsf.NAP1_PAGING,
        component: CustMainDataPagingDsfComponent,
        data: {
          title: 'Cust Main Data Paging Dsf'
        }
      },
      {
        path: PathConstant.NAP1_ADD,
        component: CustMainDataAddComponent,
        data: {
          title: 'Add Cust Main Data'
        }
      },
      {
        path: PathConstantDsf.NAP1_ADD,
        component: CustMainDataAddDsfComponent,
        data: {
          title: 'Add Cust Main Data DSf'
        }
      },
      {
        path: PathConstant.NAP2_PAGING,
        component: NapDetailPagingComponent,
        data: {
          title: 'NAP Detail Paging'
        }
      },
      {
        path: PathConstantDsf.NAP2_PAGING,
        component: NapDetailPagingDsfComponent,
        data: {
          title: 'NAP Detail Paging Dsf'
        }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainDataRoutingModule { }
