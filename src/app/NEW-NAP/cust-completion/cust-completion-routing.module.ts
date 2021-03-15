import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PathConstant } from "app/shared/constant/PathConstant";
import { CustCompletionDetailComponent } from "../cust-completion/cust-completion-detail/cust-completion-detail.component";
import { CustCompletionPagingComponent } from "../cust-completion/cust-completion-paging/cust-completion-paging.component";
import { CustCompletionDetailCompanyComponent } from "./cust-completion-detail/cust-completion-detail-company/cust-completion-detail-company.component";
import { CustCompletionDetailPersonalComponent } from "./cust-completion-detail/cust-completion-detail-personal/cust-completion-detail-personal.component";
import { CustCompletionOplDetailComponent } from './cust-completion-opl-detail/cust-completion-opl-detail.component';
import { CustCompletionOplDetailCompanyComponent } from './cust-completion-opl-detail/cust-completion-opl-detail-company/cust-completion-opl-detail-company.component';
import { CustCompletionOplDetailPersonalComponent } from './cust-completion-opl-detail/cust-completion-opl-detail-personal/cust-completion-opl-detail-personal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.PAGING,
        component: CustCompletionPagingComponent,
        data: {
          title: 'Cust Completion Paging'
        }
      },
      {
        path: PathConstant.DETAIL,
        component: CustCompletionDetailComponent,
        data: {
          title: 'Cust Completion Detail'
        }
      },
      {
        path: PathConstant.CUST_COMPL_PRSNL,
        component: CustCompletionDetailPersonalComponent,
        data: {
          title: 'Cust Completion Detail Personal'
        }
      },
      {
        path: PathConstant.CUST_COMPL_COY,
        component: CustCompletionDetailCompanyComponent,
        data: {
          title: 'Cust Completion Detail Company'
        }
      },
      {
        path: PathConstant.OPL_DETAIL_LOWERCASE,
        component: CustCompletionOplDetailComponent,
        data: {
          title: 'Cust Completion Detail'
        }
      },
      {
        path: PathConstant.CUST_COMPL_OPL_PRSNL,
        component: CustCompletionOplDetailPersonalComponent,
        data: {
          title: 'Cust Completion Detail Personal'
        }
      },
      {
        path: PathConstant.CUST_COMPL_OPL_COY,
        component: CustCompletionOplDetailCompanyComponent,
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