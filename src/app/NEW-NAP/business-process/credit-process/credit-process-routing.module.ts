import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneVerificationPagingComponent } from './phone-verification/phone-verification-paging/phone-verification-paging.component';
import { CreditApprovalPagingComponent } from './credit-approval/credit-approval-paging/credit-approval-paging.component';
import { CreditInvestigationPagingComponent } from './credit-investigation/credit-investigation-paging/credit-investigation-paging.component';
import { CreditInvestigationDetailComponent } from './credit-investigation/credit-investigation-detail/credit-investigation-detail.component';
import { CreditReviewPagingComponent } from './credit-review/credit-review-paging/credit-review-paging.component';
import { CreditReviewMainComponent } from './credit-review/credit-review-main/credit-review-main.component';
import { CommissionReservedFundDetailComponent } from './commission-reserved-fund/comission-reserved-fund-detail/commission-reserved-fund-detail.component';
import { CommissionReservedFundPagingComponent } from './commission-reserved-fund/comission-reserved-fund-paging/commission-reserved-fund-paging.component';
import { FraudDetectionVerifComponent } from './fraud-detection/fraud-detection-verif/fraud-detection-verif.component';
import { FraudDetectionPagingComponent } from './fraud-detection/fraud-detection-paging/fraud-detection-paging.component';
import { PhoneVerificationSubjectComponent } from './phone-verification/phone-verification-subject/phone-verification-subject.component';
import { PhoneVerificationSubjectVerifComponent } from './phone-verification/phone-verification-subject-verif/phone-verification-subject-verif.component';
import { PhoneVerificationSubjectViewComponent } from './phone-verification/phone-verification-subject-view/phone-verification-subject-view.component';
import { CreditInquiryComponent } from './credit-inquiry/credit-inquiry.component';
import { FraudVerificationMultiAssetComponent } from './fraud-verification-multi-asset/fraud-verification-multi-asset.component';
import { CreditApprovalDetailComponent } from './credit-approval/credit-approval-detail/credit-approval-detail.component';
import { NewCreditInvestigationDetailComponent } from './new-credit-investigation/new-credit-investigation-detail/new-credit-investigation-detail.component';
import { NewCreditInvestigationComponent } from './new-credit-investigation/new-credit-investigation.component';
import { CreditReviewCfnaComponent } from './credit-review-cfna/credit-review-cfna-detail/credit-review-cfna.component';
import { CreditReviewCfnaPagingComponent } from './credit-review-cfna/credit-review-cfna-paging/credit-review-cfna-paging.component';
import { CreditApprovalCfnaComponent } from './credit-approval-cfna/credit-approval-cfna-detail/credit-approval-cfna.component';
import { CreditApprovalCfnaPagingComponent } from './credit-approval-cfna/credit-approval-cfna-paging/credit-approval-cfna-paging.component';
import { CreditReviewComponent } from './credit-review-prototype/credit-review-paging/credit-review-paging.component';
import { CreditReviewDetailPersonalComponent } from './credit-review-prototype/credit-review-detail-personal/credit-review-detail-personal.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'CommissionReservedFund/Paging',
        component: CommissionReservedFundPagingComponent,
        data: {
          title: 'Commission Reserved Fund Paging'
        }
      },
      {
        path: 'CommissionReservedFund/Detail',
        component: CommissionReservedFundDetailComponent,
        data: {
          title: 'Commission Reserved Fund Detail'
        }
      },
      {
        path: 'PhoneVerification/Paging',
        component: PhoneVerificationPagingComponent,
        data: {
          title: 'Phone Verification Paging'
        }
      },
      {
        path: 'PhoneVerification/Subject',
        component: PhoneVerificationSubjectComponent,
        data: {
          title: 'Phone Verification Subject View'
        }
      },
      {
        path: 'PhoneVerification/Subject/View',
        component: PhoneVerificationSubjectViewComponent,
        data: {
          title: 'Phone Verification Subject View Detail'
        }
      },
      {
        path: 'PhoneVerification/Subject/Verif',
        component: PhoneVerificationSubjectVerifComponent,
        data: {
          title: 'Phone Verification Subject Verif'
        }
      },
      {
        path: 'CreditInvestigation/Paging',
        component: CreditInvestigationPagingComponent,
        data: {
          title: 'Credit Investigation'
        }
      },
      {
        path: 'CreditInvestigation/Detail',
        component: CreditInvestigationDetailComponent,
        data: {
          title: 'Credit Investigation'
        }
      },
      {
        path: 'NewCreditInvestigation/Paging',
        component: NewCreditInvestigationComponent,
        data: {
          title: 'Credit Investigation'
        }
      },
      {
        path: 'NewCreditInvestigation/Detail',
        component: NewCreditInvestigationDetailComponent,
        data: {
          title: 'Credit Investigation'
        }
      },
      {
        path: 'CreditReview/Paging',
        component: CreditReviewPagingComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: 'CreditReviewPrototype/Paging',
        component: CreditReviewComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: 'CreditReviewPrototype/Detail',
        component: CreditReviewDetailPersonalComponent,
        data: {
          title: 'Credit Review Detail'
        }
      },
      {
        path: 'CreditReview/Main',
        component: CreditReviewMainComponent,
        data: {
          title: 'Credit Review Main'
        }
      },
      {
        path: 'CreditReviewCfna/Paging',
        component: CreditReviewCfnaPagingComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: 'CreditReviewCfna/Main',
        component: CreditReviewCfnaComponent,
        data: {
          title: 'Credit Review Main'
        }
      },
      {
        path: 'CreditApproval/Paging',
        component: CreditApprovalPagingComponent,
        data: {
          title: 'Credit Approval Paging'
        }
      },
      {
        path: 'CreditApproval/Detail',
        component: CreditApprovalDetailComponent,
        data: {
          title: 'Credit Approval Detail'
        }
      },
      {
        path: 'CreditApprovalCfna/Paging',
        component: CreditApprovalCfnaPagingComponent,
        data: {
          title: 'Credit Approval Paging'
        }
      },
      {
        path: 'CreditApprovalCfna/Detail',
        component: CreditApprovalCfnaComponent,
        data: {
          title: 'Credit Approval Detail'
        }
      },
      {
        path: 'FraudDetection/Detail',
        component: FraudDetectionVerifComponent,
        data: {
          title: 'Fraud Detection'
        }
      },
      {
        path: 'FraudDetection/Paging',
        component: FraudDetectionPagingComponent,
        data: {
          title: 'Fraud Detection Paging'
        }
      },
      {
        path: 'FraudVerifMultiAsset/Paging',
        component: FraudVerificationMultiAssetComponent,
        data: {
          title: 'Fraud Verification'
        }
      },
      {
        path: 'CreditInquiry/Paging',
        component: CreditInquiryComponent,
        data: {
          title: 'Credit Process Inquiry'
        }
      },
      {
        path: 'FraudDetection/NegativeAssetDuplicateChecking',
      component: FraudVerificationMultiAssetComponent,
        data: {
          title: 'Credit Process Inquiry'
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
