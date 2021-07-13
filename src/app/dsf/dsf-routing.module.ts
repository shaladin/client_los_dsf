import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { CustomerGroupPlafondDetailComponent } from './customer/customer-group-plafond/customer-group-plafond-detail/customer-group-plafond-detail.component';
import { CustomerGroupPlafondPagingComponent } from './customer/customer-group-plafond/customer-group-plafond-paging/customer-group-plafond-paging.component';
import { AfternoonmonitoringComponent } from './report/factoring/afternoonmonitoring/afternoonmonitoring.component';
import { CollateralComponent } from './report/factoring/collateral/collateral.component';
import { InvoicekwitansitandaterimaDetailComponent } from './report/factoring/invoicekwitansitandaterima/invoicekwitansitandaterima-detail/invoicekwitansitandaterima-detail.component';
import { InvoicekwitansitandaterimaPagingComponent } from './report/factoring/invoicekwitansitandaterima/invoicekwitansitandaterima-paging/invoicekwitansitandaterima-paging.component';
import { MorningmonitoringComponent } from './report/factoring/morningmonitoring/morningmonitoring.component';
import { NewallocationceilingComponent } from './report/factoring/newallocationceiling/newallocationceiling.component';
import { Reminder1Component } from './report/factoring/reminder1/reminder1.component';
import { Reminder5Component } from './report/factoring/reminder5/reminder5.component';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_MORNING_MONITORING,
        component: MorningmonitoringComponent,
        data: {
          title: "Report Fact Morning Monitoring"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_AFTERNOON_MONITORING,
        component: AfternoonmonitoringComponent,
        data: {
          title: "Report Fact Afternoon Monitoring"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_COLLATERAL,
        component: CollateralComponent,
        data: {
          title: "Report Fact Collateral"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_REMINDER1,
        component: Reminder1Component,
        data: {
          title: "Report Fact Reminder1"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_REMINDER5,
        component: Reminder5Component,
        data: {
          title: "Report Fact Reminder5"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_NEW_ALLOCATION_CEILING,
        component: NewallocationceilingComponent,
        data: {
          title: "Report Fact New Allocation Ceiling"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_PAGING,
        component: InvoicekwitansitandaterimaPagingComponent,
        data: {
          title: "Report Fact Invoice Kwitansi Tanda Terima Paging"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_INVOICE_KWITANSI_TANDATERIMA_DETAIL,
        component: InvoicekwitansitandaterimaDetailComponent,
        data: {
          title: "Report Fact Invoice Kwitansi Tanda Terima Detail"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.CUSTOMER_GROUP_PLAFOND_PAGING,
        component:  CustomerGroupPlafondPagingComponent,
        data: {
          title: "Customer Group Plafond Paging"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.CUSTOMER_GROUP_PLAFOND_DETAIL,
        component:  CustomerGroupPlafondDetailComponent,
        data: {
          title: "Customer Group Plafond Detail"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsfRoutingModule { }
