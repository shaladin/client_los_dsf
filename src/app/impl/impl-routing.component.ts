import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CessieCancellationDetailComponent } from './cessie/cessie-cancel/detail/cessie-cancel-detail.component';
import { CessieCancellationPagingComponent } from './cessie/cessie-cancel/paging/cessie-cancel-paging.component';
import { CessieInquiryComponent } from './cessie/cessie-inquiry/cessie-inquiry.component';
import { CessieMonitoringComponent } from './cessie/cessie-upload/cessie-monitoring.component';
import { FactoringReviewAssignProductComponent } from './cessie/factoring-review/factoring-review-detail/factoring-review-assign-product/factoring-review-assign-product.component';
import { FactoringReviewDetailComponent } from './cessie/factoring-review/factoring-review-detail/factoring-review-detail.component';
import { FactoringReviewPagingComponent } from './cessie/factoring-review/factoring-review-paging/factoring-review-paging.component';
import { CessiePreGoLiveApprovalDetailComponent } from './cessie/pre-go-live/pre-go-live-approval-detail/pre-go-live-approval-detail.component';
import { CessiePreGoLiveApprovalPagingComponent } from './cessie/pre-go-live/pre-go-live-approval-paging/pre-go-live-approval-paging.component';
import { CessiePreGoLivePagingComponent } from './cessie/pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { CessiePreGoLiveComponent } from './cessie/pre-go-live/pre-go-live/pre-go-live.component';
import { EditCommAfterApprovalApprovalDetailXComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-approval-detail/edit-comm-after-approval-approval-detail-x.component';
import { EditCommAfterApprovalApprovalPagingXComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-approval-paging/edit-comm-after-approval-approval-paging-x.component';
import { EditCommAfterApprovalDetailXComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-detail/edit-comm-after-approval-detail-x.component';
import { EditCommAfterApprovalInquiryDetailComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-inquiry-detail/edit-comm-after-approval-inquiry-detail.component';
import { EditCommAfterApprovalInquiryPagingComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-inquiry-paging/edit-comm-after-approval-inquiry-paging.component';
import { EditCommAfterApprovalPagingXComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-paging/edit-comm-after-approval-paging-x.component';
import { PathConstantX } from './shared/constant/PathConstantX';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstantX.CESSIE_MONITORING,
        component: CessieMonitoringComponent,
        data: {
          title: 'Cessie Monitoring'
        }
      },
      {
        path: PathConstantX.FACTORING_REVIEW_PAGING,
        component: FactoringReviewPagingComponent,
        data: {
          title: 'Cessie Factoring Review Paging'
        }
      },
      {
        path: PathConstantX.FACTORING_REVIEW_ASSIGN_PROD,
        component: FactoringReviewAssignProductComponent,
        data: {
          title: 'Cessie Factoring Review Assign Product'
        }
      },
      {
        path: PathConstantX.FACTORING_REVIEW_DETAIL,
        component: FactoringReviewDetailComponent,
        data: {
          title: 'Cessie Factoring Review Detail'
        }
      },
      {
        path: PathConstantX.CESSIE_PGL_PAGING,
        component: CessiePreGoLivePagingComponent,
        data: {
          title: 'Cessie Pre GoLive Paging'
        }
      },
      {
        path: PathConstantX.CESSIE_PGL_DETAIL,
        component: CessiePreGoLiveComponent,
        data: {
          title: 'Cessie Pre GoLive Detail'
        }
      },
      {
        path: PathConstantX.CESSIE_PGL_APPRVL_PAGING,
        component: CessiePreGoLiveApprovalPagingComponent,
        data: {
          title: 'Cessie Pre GoLive Approval Paging'
        }
      },
      {
        path: PathConstantX.CESSIE_PGL_APPRVL_DETAIL,
        component: CessiePreGoLiveApprovalDetailComponent,
        data: {
          title: 'Cessie Pre GoLive Approval Detail'
        }
      },
      {
        path: PathConstantX.CESSIE_CANCEL_PAGING,
        component: CessieCancellationPagingComponent,
        data: {
          title: 'Cessie Cancellation Paging'
        }
      },
      {
        path: PathConstantX.CESSIE_CANCEL_DETAIL,
        component: CessieCancellationDetailComponent,
        data: {
          title: 'Cessie Cancellation Detail'
        }
      },
      {
        path: PathConstantX.CESSIE_INQUIRY,
        component: CessieInquiryComponent,
        data: {
          title: 'Cessie Inquiry'
        }
      },
      {
        path: PathConstantX.EDIT_COMM_AFT_APV_INQUIRY_PAGING,
        component: EditCommAfterApprovalInquiryPagingComponent,
        data: {
          title: 'Commission Inquiry Paging'
        }
      },
      {
        path: PathConstantX.EDIT_COMM_AFT_APV_INQUIRY_DETAIL,
        component: EditCommAfterApprovalInquiryDetailComponent,
        data: {
          title: 'Commission Inquiry Detail'
        }
      },
      {
        path: PathConstantX.EDIT_COMM_AFT_APV_PAGING,
        component: EditCommAfterApprovalPagingXComponent,
        data: {title: 'Edit Application Commission Reserved Fund After Approval Request Paging'}
      },
      {
        path: PathConstantX.EDIT_COMM_AFT_APV_DETAIL_X,
        component: EditCommAfterApprovalDetailXComponent,
        data: {title: 'Edit Commission Reserved Fund After Approval Request Detail'}
      },
      {
        path: PathConstantX.EDIT_COMM_AFT_APV_APPRV_PAGING,
        component: EditCommAfterApprovalApprovalPagingXComponent,
        data: {title: 'Edit Commission After Approval - Approval Paging'}
      },
      {
        path: PathConstantX.EDIT_COMM_AFT_APV_APPRV_DETAIL,
        component: EditCommAfterApprovalApprovalDetailXComponent,
        data: {title: 'Edit Commission After Approval - Approval Detail'}
      },


      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImplRoutingModule { }
