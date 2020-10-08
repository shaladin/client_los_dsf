import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustMainDataAddComponent } from "./cust-main-data/cust-main-data-add/cust-main-data-add.component";
import { CustMainDataPagingComponent } from "./cust-main-data/cust-main-data-paging/cust-main-data-paging.component";
import { MainDataComponent } from "./main-data.component";
import { NapDetailPagingComponent } from "./nap-detail/nap-detail-paging/nap-detail-paging.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'MainDataContainer',
        component: MainDataComponent,
        data: {
          title: 'MainDataContainer'
        }
      },
      {
        path: 'CustMainData/Paging',
        component: CustMainDataPagingComponent,
        data: {
          title: 'Cust Main Data Paging'
        }
      },
      {
        path: 'CustMainData/Add',
        component: CustMainDataAddComponent,
        data: {
          title: 'Add Cust Main Data'
        }
      },
      {
        path: 'CustMainData/Detail',
        component: MainDataComponent,
        data: {
          title: 'Cust Main Data Detail'
        }
      },
      {
        path: 'NapDetail/Paging',
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
