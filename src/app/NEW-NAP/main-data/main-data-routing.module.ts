import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PathConstant } from "app/shared/constant/PathConstant";
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
        path: PathConstant.NAP1_ADD,
        component: CustMainDataAddComponent,
        data: {
          title: 'Add Cust Main Data'
        }
      },
      {
        path: PathConstant.NAP2_PAGING,
        component: NapDetailPagingComponent,
        data: {
          title: 'NAP Detail Paging'
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
