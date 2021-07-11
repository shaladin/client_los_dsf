import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsfRoutingModule } from './dsf-routing.module';
import { UcreportModule } from '@adins/ucreport';
import { MorningmonitoringComponent } from './report/factoring/morningmonitoring/morningmonitoring.component';
import { AfternoonmonitoringComponent } from './report/factoring/afternoonmonitoring/afternoonmonitoring.component';
import { CollateralComponent } from './report/factoring/collateral/collateral.component';
import { Reminder1Component } from './report/factoring/reminder1/reminder1.component';
import { Reminder5Component } from './report/factoring/reminder5/reminder5.component';
import { NewallocationceilingComponent } from './report/factoring/newallocationceiling/newallocationceiling.component';
import { InvoicekwitansitandaterimaPagingComponent } from './report/factoring/invoicekwitansitandaterima/invoicekwitansitandaterima-paging/invoicekwitansitandaterima-paging.component';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { UcpagingModule } from '@adins/ucpaging';
import { InvoicekwitansitandaterimaDetailComponent } from './report/factoring/invoicekwitansitandaterima/invoicekwitansitandaterima-detail/invoicekwitansitandaterima-detail.component';

@NgModule({
  declarations: [MorningmonitoringComponent, AfternoonmonitoringComponent, CollateralComponent, Reminder1Component, Reminder5Component, NewallocationceilingComponent, InvoicekwitansitandaterimaPagingComponent, InvoicekwitansitandaterimaDetailComponent],
  imports: [
    CommonModule,
    DsfRoutingModule,
    AdInsModule,
    UcreportModule,
    UcpagingModule
  ]
})
export class DsfModule { }
