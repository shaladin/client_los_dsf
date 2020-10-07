import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustCompletionDetailComponent } from "../cust-completion/cust-completion-detail/cust-completion-detail.component";
import { CustCompletionPagingComponent } from "../cust-completion/cust-completion-paging/cust-completion-paging.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'CustCompletion/Paging',
          component: CustCompletionPagingComponent,
          data: {
            title: 'Cust Completion Paging'
          }
        },
        {
          path: 'CustCompletion/Detail',
          component: CustCompletionDetailComponent,
          data: {
            title: 'Cust Completion Detail'
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