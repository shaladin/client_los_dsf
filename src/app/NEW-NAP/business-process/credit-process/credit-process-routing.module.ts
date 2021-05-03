import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneVerificationPagingComponent } from './phone-verification/phone-verification-paging/phone-verification-paging.component';
import { CommissionReservedFundDetailComponent } from './commission-reserved-fund/comission-reserved-fund-detail/commission-reserved-fund-detail.component';
import { CommissionReservedFundPagingComponent } from './commission-reserved-fund/comission-reserved-fund-paging/commission-reserved-fund-paging.component';
import { PhoneVerificationSubjectComponent } from './phone-verification/phone-verification-subject/phone-verification-subject.component';
import { PhoneVerificationSubjectVerifComponent } from './phone-verification/phone-verification-subject-verif/phone-verification-subject-verif.component';
import { PhoneVerificationSubjectViewComponent } from './phone-verification/phone-verification-subject-view/phone-verification-subject-view.component';
import { CreditInquiryComponent } from './credit-inquiry/credit-inquiry.component';
import { CreditReviewComponent } from './credit-review-prototype/credit-review-paging/credit-review-paging.component';
import { CreditReviewDetailPersonalComponent } from './credit-review-prototype/credit-review-detail-personal/credit-review-detail-personal.component';
import { CreditReviewCrDetailComponent } from './credit-review-cr/credit-review-cr-detail/credit-review-cr-detail.component';
import { CreditReviewCrPagingComponent } from './credit-review-cr/credit-review-cr-paging/credit-review-cr-paging.component';
import { CreditApprovalCrPagingComponent } from './credit-approval-cr/credit-approval-cr-paging/credit-approval-cr-paging.component';
import { CreditApprovalCrDetailComponent } from './credit-approval-cr/credit-approval-cr-detail/credit-approval-cr-detail.component';
import { PathConstant } from 'app/shared/constant/PathConstant';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.COMM_RSV_FUND_PAGING,
        component: CommissionReservedFundPagingComponent,
        data: {
          title: 'Commission Reserved Fund Paging'
        }
      },
      {
        path: PathConstant.COMM_RSV_FUND_DETAIL,
        component: CommissionReservedFundDetailComponent,
        data: {
          title: 'Commission Reserved Fund Detail'
        }
      },
      {
        path: PathConstant.PHN_VRF_PAGING,
        component: PhoneVerificationPagingComponent,
        data: {
          title: 'Phone Verification Paging'
        }
      },
      {
        path: PathConstant.PHN_VRF_SUBJECT,
        component: PhoneVerificationSubjectComponent,
        data: {
          title: 'Phone Verification Subject View'
        }
      },
      {
        path: PathConstant.PHN_VRF_SUBJECT_VIEW,
        component: PhoneVerificationSubjectViewComponent,
        data: {
          title: 'Phone Verification Subject View Detail'
        }
      },
      {
        path: PathConstant.PHN_VRF_SUBJECT_VERIF,
        component: PhoneVerificationSubjectVerifComponent,
        data: {
          title: 'Phone Verification Subject Verif'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_PROTOTYPE_PAGING,
        component: CreditReviewComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_PROTOTYPE_DETAIL,
        component: CreditReviewDetailPersonalComponent,
        data: {
          title: 'Credit Review Detail'
        }
      },
      {
        path: PathConstant.CRD_INQUIRY_PAGING,
        component: CreditInquiryComponent,
        data: {
          title: 'Credit Process Inquiry'
        }
      },
      {
          path: PathConstant.CRD_REVIEW_CR_PAGING,
          component: CreditReviewCrPagingComponent,
          data: {
              title: 'Credit Review Paging'
          }
      },
      {
          path: PathConstant.CRD_REVIEW_CR_DETAIL,
          component: CreditReviewCrDetailComponent,
          data: {
              title: 'Credit Review Detail'
          }
      },
      {
          path: PathConstant.CRD_APPRV_CR_PAGING,
          component: CreditApprovalCrPagingComponent,
          data: {
              title: 'Credit Approval Paging'
          }
      },
      {
          path: PathConstant.CRD_APPRV_CR_DETAIL,
          component: CreditApprovalCrDetailComponent,
          data: {
              title: 'Credit Approval Detail'
          }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditProcessSharingRoutingModule { }
