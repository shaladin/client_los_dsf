import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CreditInvestigationDetailComponent } from "./credit-investigation/credit-investigation-detail/credit-investigation-detail.component";
import { CustHistoryComponent } from "./credit-investigation/component/cust-history/cust-history.component";
import { CommissionPagingComponent } from "./commission-paging/commission-paging.component";
import { CommissionAddComponent } from "./commission-add/commission-add.component";
import { RsvFundPagingComponent } from "./reserved-fund/reserved-fund-paging/reserved-fund-paging.component";
import { RsvFundViewComponent } from "./reserved-fund/reserved-fund-view/reserved-fund-view.component";
import { CommissionReservedFundComponent } from "./commission-reserved-fund/commission-reserved-fund.component";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'CreditInvestigation/Detail',
        component: CreditInvestigationDetailComponent,
        data: {
            title: 'Credit Investigation'
        }
      },
      {
        path: 'CreditInvestigation/Component/CustHistory',
        component: CustHistoryComponent,
        data: {
            title: 'Customer History'
        }
      },
      
      {
        path: 'CommissionPaging',
        component: CommissionPagingComponent,
        data: {
          title: 'Commission Paging'
        }
      },
      // {
      //   path: 'CommissionAdd',
      //   component: CommissionAddComponent,
      //   data: {
      //     title: 'Commission Add'
      //   }
      // },
      // {
      //     path: 'ReservedFund',
      //     component: RsvFundPagingComponent,
      //     data: {
      //         title: 'Reserved Fund Paging'
      //     }
      // },
      // {
      //     path: 'ReservedFund/View',
      //     component: RsvFundViewComponent,
      //     data: {
      //         title: 'Reserved Fund View'
      //     }
      // },
      {
          path: 'CommissionReserveFund',
          component: CommissionReservedFundComponent,
          data: {
              title: 'Commission Reserved Fund'
          }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreditProcessRoutingModule { }
