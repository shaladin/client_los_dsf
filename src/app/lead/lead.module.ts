import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UclookupgenericModule, UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcviewgenericModule, UcviewgenericComponent } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
import { UCSearchComponent } from '@adins/ucsearch';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
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
import { UcuploadModule } from "@adins/ucupload";
import { LeadMonitoringReviewComponent } from './lead-monitoring-review/lead-monitoring-review.component';
import { LeadMonitoringReviewDetailComponent } from './lead-monitoring-review/lead-monitoring-review-detail/lead-monitoring-review-detail.component';
import { UcaddtotempModule } from "@adins/ucaddtotemp";
import { GeneratePotentialRoComponent } from "./potential-ro/generate-potential-ro/generate-potential-ro.component";
import { UcgridviewModule } from "@adins/ucgridview";
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
import { RoPotentialViewComponent } from "./potential-ro/ro-potential-view/ro-potential-view.component";
import { RoPotentialExecutionComponent } from "./potential-ro/ro-potential-execution/ro-potential-execution.component";
import { NewLeadInputLeadDataComponent } from './new-lead-input/new-lead-input-lead-data/new-lead-input-lead-data.component';
import { NewLeadInputPageComponent } from './new-lead-input/new-lead-input-page/new-lead-input-page.component';
import { SimpleLeadMonitoringComponent } from './simple-lead-monitoring/simple-lead-monitoring.component';
import { SimpleLeadMonitoringReviewComponent } from './simple-lead-monitoring-review/simple-lead-monitoring-review.component';
import { SimpleLeadMonitoringReviewDetailComponent } from './simple-lead-monitoring-review/simple-lead-monitoring-review-detail/simple-lead-monitoring-review-detail.component';

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
  imports: [
    LeadRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    SharingModule,
    ReactiveFormsModule,
    UcaddressModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    UclookupgenericModule,
    UcviewgenericModule,
    SharingComponentModule,
    ArchwizardModule,
    MatRadioModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CustSharingComponentModule,
    UcuploadModule,
    UcaddtotempModule,
    UcgridviewModule,
    SharedModule
  ],
  declarations: [
    LeadVerifComponent,
    LeadCancelComponent,
    LeadCancelConfirmComponent,
    FraudVerifPagingComponent, FraudVerifPageComponent, LeadInquiryComponent,
    GeneratePotentialRoComponent,
    RoTelemkOfferPagingComponent,
    RoTelemkOfferDetailComponent,
    RoTelemkOfferVerifComponent,
    RoPotentialInquiryComponent,
    RoPotentialExecutionComponent,
    RoPotentialViewComponent,
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
    LeadMonitoringComponent, LeadMonitoringReviewComponent, LeadMonitoringReviewDetailComponent, NewLeadInputComponent, NewLeadInputMainInfoComponent, NewLeadInputCustDataComponent, NewFraudVerifComponent, NewFraudVerifDetailComponent, NewLeadUpdateComponent, NewLeadInputLeadDataComponent, NewLeadInputPageComponent, SimpleLeadMonitoringComponent, SimpleLeadMonitoringReviewComponent, SimpleLeadMonitoringReviewDetailComponent
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