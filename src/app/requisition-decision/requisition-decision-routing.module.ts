import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RequisitionDecisionPagingComponent } from './requisition-decision-paging/requisition-decision-paging.component';
import { RequisitionDecisionDetailComponent } from './requisition-decision-detail/requisition-decision-detail.component';
import { PathConstant } from "app/shared/constant/PathConstant";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: PathConstant.PAGING_LOWERCASE, component: RequisitionDecisionPagingComponent, data: { title: 'Requisition Decision Paging' } },
      { path: PathConstant.DETAIL_LOWERCASE, component: RequisitionDecisionDetailComponent, data: { title: 'Requisition Decision Detail' } }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RequisitionDecisionRoutingModule { }