import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CreditInvestigationDetailComponent } from "./credit-investigation/credit-investigation-detail/credit-investigation-detail.component";


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
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreditProcessRoutingModule { }
