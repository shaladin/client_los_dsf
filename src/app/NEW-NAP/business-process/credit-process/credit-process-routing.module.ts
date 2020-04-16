import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneVerificationPagingComponent } from './phone-verification/phone-verification-paging/phone-verification-paging.component';
import { RsvFundPagingComponent } from './reserved-fund/reserved-fund-paging/reserved-fund-paging.component';
import { CommissionPagingComponent } from './commission/commission-paging/commission-paging.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditProcessSharingRoutingModule { }
