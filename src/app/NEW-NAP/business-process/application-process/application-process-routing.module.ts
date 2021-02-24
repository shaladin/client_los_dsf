import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { ApplicationApprovalDetailComponent } from './application-approval/application-approval-detail/application-approval-detail.component';
import { ApplicationApprovalPagingComponent } from './application-approval/application-approval-paging/application-approval-paging.component';
import { ApplicationReviewDetailComponent } from './application-review/application-review-detail/application-review-detail.component';
import { ApplicationReviewPagingComponent } from './application-review/application-review-paging/application-review-paging.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.APP_RVW_PAGING,
        component: ApplicationReviewPagingComponent,
        data: {
          title: 'Application Review Paging'
        }
      },
      {
        path: PathConstant.APP_RVW_DETAIL,
        component: ApplicationReviewDetailComponent,
        data: {
          title: 'Application Review Detail'
        }
      },
      {
        path: PathConstant.APP_APPRV_PAGING,
        component: ApplicationApprovalPagingComponent,
        data: {
          title: 'Application Approval Paging'
        }
      },
      {
        path: PathConstant.APP_APPRV_DETAIL,
        component: ApplicationApprovalDetailComponent,
        data: {
          title: 'Application Approval Detail'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationProcessSharingRoutingModule { }
