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
        path: 'PhoneVerification/View',
        component: PhoneVerificationPagingComponent,
        data: {
          title: 'Phone Verification View'
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
        path: 'CreditReview/Paging',
        component: CreditReviewPagingComponent,
        data: {
          title: 'Credit Review Paging'
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
        path: 'CreditApproval/Paging',
        component: CreditApprovalPagingComponent,
        data: {
          title: 'Credit Approval Paging'
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditProcessSharingRoutingModule { }
