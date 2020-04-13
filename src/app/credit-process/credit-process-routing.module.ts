import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CreditInvestigationDetailComponent } from "./credit-investigation/credit-investigation-detail/credit-investigation-detail.component";
import { CustHistoryComponent } from "./credit-investigation/component/cust-history/cust-history.component";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'CreditInvestigation/Detail',
        component: CreditInvestigationDetailComponent,
        data: {
            title: 'Credit Investigation'
        }
      },
      {
        path: 'CreditInvestigation/Component/CustHistory',
        component: CustHistoryComponent,
        data: {
            title: 'Customer History'
        }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreditProcessRoutingModule { }
