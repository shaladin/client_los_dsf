import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationReviewDetailComponent } from './application-review/application-review-detail/application-review-detail.component';
import { ApplicationReviewPagingComponent } from './application-review/application-review-paging/application-review-paging.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ApplicationReview/Paging',
        component: ApplicationReviewPagingComponent,
        data: {
          title: 'Application Review Paging'
        }
      },
      {
        path: 'ApplicationReview/Detail',
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
