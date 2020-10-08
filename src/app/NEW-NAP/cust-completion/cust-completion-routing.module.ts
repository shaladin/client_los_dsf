import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustCompletionDetailComponent } from "../cust-completion/cust-completion-detail/cust-completion-detail.component";
import { CustCompletionPagingComponent } from "../cust-completion/cust-completion-paging/cust-completion-paging.component";
import { CustCompletionDetailCompanyComponent } from "./cust-completion-detail/cust-completion-detail-company/cust-completion-detail-company.component";
import { CustCompletionDetailPersonalComponent } from "./cust-completion-detail/cust-completion-detail-personal/cust-completion-detail-personal.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'Paging',
          component: CustCompletionPagingComponent,
          data: {
            title: 'Cust Completion Paging'
          }
        },
        {
          path: 'Detail',
          component: CustCompletionDetailComponent,
          data: {
            title: 'Cust Completion Detail'
          }
        },
        {
          path: 'Detail/Personal',
          component: CustCompletionDetailPersonalComponent,
          data: {
            title: 'Cust Completion Detail Personal'
          }
        },
        {
          path: 'Detail/Company',
          component: CustCompletionDetailCompanyComponent,
          data: {
            title: 'Cust Completion Detail Company'
          }
        }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CustCompletionRoutingModule { }