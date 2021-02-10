import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationProcessSharingRoutingModule { }
