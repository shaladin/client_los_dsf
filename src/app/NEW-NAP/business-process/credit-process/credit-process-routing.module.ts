import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneVerificationPagingComponent } from './phone-verification/phone-verification-paging/phone-verification-paging.component';
import { RsvFundPagingComponent } from './reserved-fund/reserved-fund-paging/reserved-fund-paging.component';
import { CommissionPagingComponent } from './commission/commission-paging/commission-paging.component';
import { CreditApprovalPagingComponent } from './credit-approval/credit-approval-paging/credit-approval-paging.component';
import { CreditReviewPagingComponent } from './credit-review/credit-review-paging/credit-review-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Commission/Paging',
        component: CommissionPagingComponent,
        data: {
          title: 'Commission Paging'
        }
      },
      {
        path: 'PhnVerf/Paging',
        component: PhoneVerificationPagingComponent,
        data: {
          title: 'Phone Verification Paging'
        }
      },
      {
          path: 'ReservedFund/Paging',
          component: RsvFundPagingComponent,
          data: {
              title: 'Reserved Fund Paging'
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
          path: 'CreditApproval/Paging',
          component: CreditApprovalPagingComponent,
          data: {
              title: 'Credit Approval Paging'
          }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditProcessSharingRoutingModule { }
