import { NgModule } from "@angular/core";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
// import { MainInfoComponent } from 'app/view/main-info/main-info.component';
import { LeadRoutingModule } from "./lead-routing.module";
// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadInputComponent } from "./lead-input/lead-input.component";
import { LeadInputPageComponent } from "./lead-input/lead-input-page/lead-input-page.component";
import { LeadInputMainInfoComponent } from "./lead-input/lead-input-main-info/lead-input-main-info.component";
import { LeadViewHeaderComponent } from "./lead-input/lead-view-header/lead-view-header.component";
import { LeadCancelComponent } from './lead-cancel/lead-cancel/lead-cancel.component';
import { LeadCancelConfirmComponent } from './lead-cancel/lead-cancel-confirm/lead-cancel-confirm.component';
import { FraudVerifPagingComponent } from './fraud-verif/fraud-verif-paging/fraud-verif-paging.component';
import { FraudVerifPageComponent } from './fraud-verif/fraud-verif-page/fraud-verif-page.component';
import { LeadInquiryComponent } from './lead-inquiry/lead-inquiry.component';
import { TeleVerifPagingComponent } from './tele-verif/tele-verif-paging/tele-verif-paging.component';
import { TeleVerifDetailComponent } from './tele-verif/tele-verif-detail/tele-verif-detail.component';
import { LeadInputLeadDataComponent } from "./lead-input/lead-input-lead-data/lead-input-lead-data.component";
import { MatRadioModule } from "@angular/material";
import { LeadUpdateComponent } from "./lead-update/lead-update.component";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { CustSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/cust-sharing-component.module";
import { LeadMonitoringComponent } from './lead-monitoring/lead-monitoring.component';
import { LeadMonitoringReviewComponent } from './lead-monitoring-review/lead-monitoring-review.component';
import { LeadMonitoringReviewDetailComponent } from './lead-monitoring-review/lead-monitoring-review-detail/lead-monitoring-review-detail.component';
import { GeneratePotentialRoComponent } from "./potential-ro/generate-potential-ro/generate-potential-ro.component";
import { RoTelemkOfferPagingComponent } from "./potential-ro/ro-telemk-offer-paging/ro-telemk-offer-paging.component";
import { RoTelemkOfferDetailComponent } from "./potential-ro/ro-telemk-offer-detail/ro-telemk-offer-detail.component";
import { RoTelemkOfferVerifComponent } from "./potential-ro/ro-telemk-offer-detail/ro-telemk-offer-verif.component";
import { RoPotentialInquiryComponent } from "./potential-ro/ro-potential-inquiry/ro-potential-inquiry.component";
import { NewLeadInputComponent } from './new-lead-input/new-lead-input.component';
import { NewLeadInputMainInfoComponent } from './new-lead-input/new-lead-input-main-info/new-lead-input-main-info.component';
import { NewLeadInputCustDataComponent } from './new-lead-input/new-lead-input-cust-data/new-lead-input-cust-data.component';
import { NewFraudVerifComponent } from './new-fraud-verif/new-fraud-verif.component';
import { NewFraudVerifDetailComponent } from './new-fraud-verif/new-fraud-verif-detail/new-fraud-verif-detail.component';
import { NewLeadUpdateComponent } from './new-lead-update/new-lead-update.component';
import { SharedModule } from "app/shared/shared.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { LeadToBeFollowUpDsfComponent } from "./DSF/lead-to-be-follow-up-dsf/lead-to-be-follow-up-dsf.component";
import { RoPotentialViewComponent } from "./potential-ro/ro-potential-view/ro-potential-view.component";
import { RoPotentialExecutionComponent } from "./potential-ro/ro-potential-execution/ro-potential-execution.component";
import { NewLeadInputLeadDataComponent } from './new-lead-input/new-lead-input-lead-data/new-lead-input-lead-data.component';
import { NewLeadInputPageComponent } from './new-lead-input/new-lead-input-page/new-lead-input-page.component';
import { SimpleLeadMonitoringComponent } from './simple-lead-monitoring/simple-lead-monitoring.component';
import { SimpleLeadMonitoringReviewComponent } from './simple-lead-monitoring-review/simple-lead-monitoring-review.component';
import { SimpleLeadMonitoringReviewDetailComponent } from './simple-lead-monitoring-review/simple-lead-monitoring-review-detail/simple-lead-monitoring-review-detail.component';
import { NewLeadInputPageDsfComponent } from "app/dsf/lead/new-lead-input/new-lead-input-page-dsf/new-lead-input-page-dsf.component";
import { NewLeadInputCustDataDsfComponent } from "app/dsf/lead/new-lead-input/new-lead-input-cust-data-dsf/new-lead-input-cust-data-dsf.component";
import { UcDirectiveUpperCaseModule } from "@adins/uc-directive-upper-case";
import { NewLeadUpdateDsfComponent } from "app/dsf/lead/new-lead-update-dsf/new-lead-update-dsf.component";
import { NewLeadInputDsfComponent } from "app/dsf/lead/new-lead-input/new-lead-input.component";
import { NewLeadInputMainInfoDsfComponent } from "app/dsf/lead/new-lead-input/new-lead-input-main-info-dsf/new-lead-input-main-info-dsf.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { RoTelemkOfferDetailXComponent } from "app/impl/lead/potential-ro/ro-telemk-offer-detail/ro-telemk-offer-detail-x.component";
import { RoTelemkOfferVerifXComponent } from "app/impl/lead/potential-ro/ro-telemk-offer-detail/ro-telemk-offer-verif-x.component";
import {NewLeadInputLeadDataXComponent} from 'app/impl/lead/new-lead-input/new-lead-input-lead-data/new-lead-input-lead-data-x.component';
import {NewLeadInputPageXComponent} from 'app/impl/lead/new-lead-input/new-lead-input-page/new-lead-input-page-x.component';
import { GeneratePotentialRoXComponent } from "app/impl/lead/potential-ro/generate-potential-ro/generate-potential-ro-x.component";
import { GeneratePotentialRoDsfComponent } from "app/dsf/lead/potential-ro-dsf/generate-potential-ro-dsf/generate-potential-ro-dsf.component";
import { GeneratePotentialRoMonitoringDsfComponent } from "app/dsf/lead/potential-ro-dsf/generate-potential-ro-monitoring-dsf/generate-potential-ro-monitoring-dsf.component";
import { RoTelemkOfferPagingDsfComponent } from "app/dsf/lead/potential-ro-dsf/ro-telemk-offer-paging-dsf/ro-telemk-offer-paging-dsf.component";
import { RoTelemkOfferVerifXDsfComponent } from "app/dsf/lead/potential-ro-dsf/ro-telemk-offer-verif-x-dsf/ro-telemk-offer-verif-x-dsf.component";
import { RoPotentialViewDsfComponent } from "app/dsf/lead/potential-ro-dsf/ro-potential-view-dsf/ro-potential-view-dsf.component";
import { SimpleLeadReportDsfComponent } from 'app/dsf/lead/simple-lead-report-dsf/simple-lead-report-dsf.component';
import { LeadInquiryDsfComponent } from 'app/lead/lead-inquiry-dsf/lead-inquiry-dsf.component';
import {NewLeadInputLeadDataXDsfComponent} from 'app/dsf/lead/new-lead-input/new-lead-input-lead-data-x-dsf/new-lead-input-lead-data-x-dsf.component';
import {NewFraudVerifDsfComponent} from 'app/dsf/lead/new-fraud-verif-dsf/new-fraud-verif-dsf.component';
import {NewFraudVerifDetailDsfComponent} from 'app/dsf/lead/new-fraud-verif-dsf/new-fraud-verif-detail-dsf/new-fraud-verif-detail-dsf.component';
import {LeadCancelDsfComponent} from 'app/dsf/lead/lead-cancel-dsf/lead-cancel-dsf/lead-cancel-dsf.component';
import { LeadCancelConfirmDsfComponent } from 'app/dsf/lead/lead-cancel-dsf/lead-cancel-confirm-dsf/lead-cancel-confirm-dsf.component';

import { UcreportModule } from '@adins/ucreport';
import { NewLeadInputCustDataXDsfComponent } from "app/dsf/lead/new-lead-input/new-lead-input-cust-data-x-dsf/new-lead-input-cust-data-x-dsf.component";
import { NewLeadInputPageXDsfComponent } from "app/dsf/lead/new-lead-input/new-lead-input-page-x-dsf/new-lead-input-page-x-dsf.component";
import { NewLeadInputCustDataXComponent } from "app/impl/lead/new-lead-input/new-lead-input-cust-data/new-lead-input-cust-data-x.component";
import { NewLeadQcDsfComponent } from "app/dsf/lead/new-lead-qc-dsf/new-lead-qc-dsf.component";
import { NewLeadQcDetailDsfComponent } from "app/dsf/lead/new-lead-qc-detail-dsf/new-lead-qc-detail-dsf.component";

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  allowZero: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    LeadRoutingModule,
    AdInsSharedModule,
    SharingModule,
    SharingComponentModule,
    ArchwizardModule,
    MatRadioModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CustSharingComponentModule,
    SharedModule,
    AdInsModule,
    UcreportModule
  ],
  declarations: [
    LeadVerifComponent,
    LeadCancelComponent,
    LeadCancelConfirmComponent,
    FraudVerifPagingComponent, FraudVerifPageComponent, LeadInquiryComponent,
    GeneratePotentialRoComponent,
    GeneratePotentialRoDsfComponent,
    GeneratePotentialRoMonitoringDsfComponent,
    RoTelemkOfferPagingComponent,
    RoTelemkOfferPagingDsfComponent,
    RoTelemkOfferDetailComponent,
    RoTelemkOfferDetailXComponent,
    RoTelemkOfferVerifComponent,
    RoTelemkOfferVerifXComponent,
    RoTelemkOfferVerifXDsfComponent,
    RoPotentialInquiryComponent,
    RoPotentialExecutionComponent,
    RoPotentialViewComponent,
    RoPotentialViewDsfComponent,
    LeadInputComponent,
    LeadInputPageComponent,
    LeadInputMainInfoComponent,
    LeadViewHeaderComponent,
    TeleVerifPagingComponent,
    TeleVerifDetailComponent,
    LeadInputLeadDataComponent,
    LeadViewHeaderComponent,
    LeadUpdateComponent,
    FraudVerifPagingComponent,
    FraudVerifPageComponent,
    LeadInquiryComponent,
    LeadMonitoringComponent, LeadMonitoringReviewComponent, LeadMonitoringReviewDetailComponent, NewLeadInputComponent, NewLeadInputMainInfoComponent, NewLeadInputCustDataComponent, NewFraudVerifComponent, NewFraudVerifDetailComponent, NewLeadUpdateComponent, NewLeadInputLeadDataComponent, NewLeadInputPageComponent, SimpleLeadMonitoringComponent, SimpleLeadMonitoringReviewComponent, SimpleLeadMonitoringReviewDetailComponent,
    LeadToBeFollowUpDsfComponent,
    NewLeadInputPageDsfComponent,
    NewLeadQcDetailDsfComponent,
    NewLeadInputCustDataDsfComponent,
    NewLeadInputPageXComponent,
    NewLeadInputPageXDsfComponent,
    NewLeadInputCustDataXDsfComponent,
    NewLeadInputCustDataXComponent,
    NewLeadInputLeadDataXComponent,
    NewLeadUpdateDsfComponent,
    NewLeadQcDsfComponent,
    NewLeadInputDsfComponent,
    NewLeadInputMainInfoDsfComponent,
    GeneratePotentialRoXComponent,
    SimpleLeadReportDsfComponent,
    LeadInquiryDsfComponent,
    NewLeadInputLeadDataXDsfComponent,
    NewFraudVerifDsfComponent,
    NewFraudVerifDetailDsfComponent,
    LeadCancelDsfComponent,
    LeadCancelConfirmDsfComponent
  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent
  ],
  providers: [
    NGXToastrService
  ]
})

export class LeadModule { }
