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
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CollateraldataComponent } from './report/factoring/collateraldata/collateraldata.component';
import { CustomerGroupPlafondPagingComponent } from './customer/customer-group-plafond/customer-group-plafond-paging/customer-group-plafond-paging.component';
import { CustomerGroupPlafondDetailComponent } from './customer/customer-group-plafond/customer-group-plafond-detail/customer-group-plafond-detail.component';
import { UcapprovalcreateModule} from '@adins/ucapprovalcreate';
import { UcapprovalR3Module } from '@adins/ucapproval-r3';
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { CustomerGroupPlafondApvPagingDsfComponent } from './customer/customer-group-plafond/customer-group-plafond-apv-paging-dsf/customer-group-plafond-apv-paging-dsf.component';
import { CustomerGroupPlafondApvDetailDsfComponent } from './customer/customer-group-plafond/customer-group-plafond-apv-detail-dsf/customer-group-plafond-apv-detail-dsf.component';
import { CustomerGroupPlafondApvInquiryDsfComponent } from './customer/customer-group-plafond/customer-group-plafond-apv-inquiry-dsf/customer-group-plafond-apv-inquiry-dsf.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { AppStatusDsfComponent } from './report/app-status-dsf/app-status-dsf.component';
import { InsCompSummaryDsfComponent } from './report/insurance-company/ins-comp-summary-dsf/ins-comp-summary-dsf.component';
import { InsCompDetailDsfComponent } from './report/insurance-company/ins-comp-detail-dsf/ins-comp-detail-dsf.component';
import { DisbursementPagingDsfComponent } from './report/disbursement-dsf/disbursement-paging-dsf/disbursement-paging-dsf.component';
import { DisbursementDetailDsfComponent } from './report/disbursement-dsf/disbursement-detail-dsf/disbursement-detail-dsf.component';
export const customCurrencyMaskConfig = {     

  align: "right",     

  allowNegative: true,     

  allowZero: true,     

  decimal: ".",     

  precision: 2,     

  prefix: "",     

  suffix: "",     

  thousands: ",",     

  nullable: false,

  inputMode: CurrencyMaskInputMode.NATURAL

};

@NgModule({
  declarations: [MorningmonitoringComponent, AfternoonmonitoringComponent, CollateralComponent, Reminder1Component, Reminder5Component, NewallocationceilingComponent, InvoicekwitansitandaterimaPagingComponent, InvoicekwitansitandaterimaDetailComponent, CollateraldataComponent, CustomerGroupPlafondPagingComponent, CustomerGroupPlafondDetailComponent, CustomerGroupPlafondApvPagingDsfComponent, CustomerGroupPlafondApvDetailDsfComponent, CustomerGroupPlafondApvInquiryDsfComponent, AppStatusDsfComponent, InsCompSummaryDsfComponent, InsCompDetailDsfComponent, DisbursementPagingDsfComponent, DisbursementDetailDsfComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DsfRoutingModule,
    AdInsModule,
    UcreportModule,
    UcpagingModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ]
})
export class DsfModule { }
