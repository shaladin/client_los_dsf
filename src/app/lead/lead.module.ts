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
//import { NewLeadInputCustDataComponent } from './new-lead-input/new-lead-input-cust-data/new-lead-input-cust-data.component';
import { NewLeadInputCustDataXComponent } from "app/impl/lead/new-lead-input/new-lead-input-cust-data/new-lead-input-cust-data-x.component";
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
import { UcDirectiveUpperCaseModule } from "@adins/uc-directive-upper-case";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { RoTelemkOfferDetailXComponent } from "app/impl/lead/potential-ro/ro-telemk-offer-detail/ro-telemk-offer-detail-x.component";
import { RoTelemkOfferVerifXComponent } from "app/impl/lead/potential-ro/ro-telemk-offer-detail/ro-telemk-offer-verif-x.component";
import {NewLeadInputLeadDataXComponent} from 'app/impl/lead/new-lead-input/new-lead-input-lead-data/new-lead-input-lead-data-x.component';
import {NewLeadInputPageXComponent} from 'app/impl/lead/new-lead-input/new-lead-input-page/new-lead-input-page-x.component';
import { GeneratePotentialRoXComponent } from "app/impl/lead/potential-ro/generate-potential-ro/generate-potential-ro-x.component";
import { ThirdPartyFormXComponent } from "app/impl/lead/new-lead-input/third-party-form/third-party-form-x.component";
import { ThirdPartyUploadXService } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/services/ThirdPartyUploadX.Service";
import { AsliRiViewXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/asli-ri/view/asli-ri-view-x/asli-ri-view-x.component";
import { CustomerViewAsliRiXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/customer-view-asli-ri-x/customer-view-asli-ri-x.component";
import { PefindoReqXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/pefindo/request/pefindo-req-x.component";
import { TrustingSocialReqHeaderXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/trusting-social/request/trusting-social-req-header-x.component";
import { AsliRiReqHeaderXComponent } from "app/impl/lead/new-lead-input/third-party-form/asli-ri/request/asli-ri-req-header-x.component";
import { TrustingSocialReqConsentXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/trusting-social/request/consent/trusting-social-req-consent-x.component";
import { TrustingSocialReqDetailXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/trusting-social/request/detail/trusting-social-req-detail-x.component";
import { AsliRiReqXComponent } from "app/impl/lead/new-lead-input/third-party-form/asli-ri/request/asli-ri-req-x/asli-ri-req-x.component";
import { AsliRiReqConfirmationXComponent } from "app/impl/lead/new-lead-input/third-party-form/asli-ri/request/asli-ri-req-confirmation-x/asli-ri-req-confirmation-x.component";
import { TrustingSocialViewHeaderXComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/trusting-social/view/trusting-social-view-header-x.component";
//import { CustomerViewTrustingSocialComponent } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/customer-view-trusting-social/customer-view-trusting-social-x.component";
import { CustomerViewTrustingSocialXModule } from "app/impl/customer/sharing-component/new-cust-component/component/third-party-form/customer-view-trusting-social/customer-view-trusting-social-x.module";
import { NewLeadInputCustDataComponent } from "./new-lead-input/new-lead-input-cust-data/new-lead-input-cust-data.component";

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
    CustomerViewTrustingSocialXModule
  ],
  declarations: [
    LeadVerifComponent,
    LeadCancelComponent,
    LeadCancelConfirmComponent,
    FraudVerifPagingComponent, FraudVerifPageComponent, LeadInquiryComponent,
    GeneratePotentialRoComponent,
    RoTelemkOfferPagingComponent,
    RoTelemkOfferDetailComponent,
    RoTelemkOfferDetailXComponent,
    RoTelemkOfferVerifComponent,
    RoTelemkOfferVerifXComponent,
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
    LeadMonitoringComponent, LeadMonitoringReviewComponent, LeadMonitoringReviewDetailComponent, NewLeadInputComponent, NewLeadInputMainInfoComponent,NewLeadInputCustDataXComponent, NewFraudVerifComponent, NewFraudVerifDetailComponent, NewLeadUpdateComponent, NewLeadInputLeadDataComponent, NewLeadInputPageComponent, SimpleLeadMonitoringComponent, SimpleLeadMonitoringReviewComponent, SimpleLeadMonitoringReviewDetailComponent,
    NewLeadInputPageXComponent,
    NewLeadInputCustDataXComponent,
    NewLeadInputLeadDataXComponent,
    GeneratePotentialRoXComponent,
    ThirdPartyFormXComponent,
    AsliRiViewXComponent,
    CustomerViewAsliRiXComponent,
    PefindoReqXComponent,
    TrustingSocialReqHeaderXComponent,
    AsliRiReqHeaderXComponent,
    TrustingSocialReqConsentXComponent,
    TrustingSocialReqDetailXComponent,
    AsliRiReqXComponent,
    AsliRiReqConfirmationXComponent,
    TrustingSocialViewHeaderXComponent,
    NewLeadInputCustDataComponent,
    //CustomerViewTrustingSocialComponent
  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent,
    AsliRiViewXComponent,
    PefindoReqXComponent,
    TrustingSocialReqHeaderXComponent,
    AsliRiReqHeaderXComponent,
    TrustingSocialViewHeaderXComponent,
    //CustomerViewTrustingSocialComponent
  ],
  providers: [
    NGXToastrService,
    ThirdPartyUploadXService
  ]
})

export class LeadModule { }
