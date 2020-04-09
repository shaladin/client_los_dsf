import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RsvFundPagingComponent } from './reserved-fund/reserved-fund-paging/reserved-fund-paging.component';
import { CommissionPagingComponent } from './commission/commission-paging/commission-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
          path: 'ReservedFund/Paging',
          component: RsvFundPagingComponent,
          data: {
              title: 'Reserved Fund Paging'
          }
      },
      {
        path: 'Commission/Paging',
        component: CommissionPagingComponent,
        data: {
          title: 'Commission Paging'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RFN4WRoutingModule { }
