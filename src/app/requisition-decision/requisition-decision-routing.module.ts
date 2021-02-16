import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RequisitionDecisionPagingComponent } from './requisition-decision-paging/requisition-decision-paging.component';
import { RequisitionDecisionDetailComponent } from './requisition-decision-detail/requisition-decision-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'paging', component: RequisitionDecisionPagingComponent, data: { title: 'Requisition Decision Paging' } },
      { path: 'detail', component: RequisitionDecisionDetailComponent, data: { title: 'Requisition Decision Detail' } }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RequisitionDecisionRoutingModule { }