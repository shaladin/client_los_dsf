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
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
import { UCSearchComponent } from '@adins/ucsearch';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
// import { MainInfoComponent } from 'app/view/main-info/main-info.component';
import { LeadRoutingModule } from "./lead-routing.module";
import { CustomerSelfVerificationComponent } from './verification/customer-self-verification/customer-self-verification.component';
import { CustomerDataComponent } from './verification/customer-self-verification/customer-data/customer-data.component';
import { LeadDataComponent } from './verification/customer-self-verification/lead-data/lead-data.component';
import { LeadMainInfoComponent } from 'app/view/lead-main-info/lead-main-info.component';
// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadInputComponent } from "./lead-input/lead-input.component";
import { LeadInputCustDataComponent } from "./lead-input/lead-input-cust-data/lead-input-cust-data.component";
import { LeadInputPageComponent } from "./lead-input/lead-input-page/lead-input-page.component";
import { LeadInputMainInfoComponent } from "./lead-input/lead-input-main-info/lead-input-main-info.component";
import { LeadViewHeaderComponent } from "./lead-input/lead-view-header/lead-view-header.component";
import { LeadCancelComponent } from './lead-cancel/lead-cancel/lead-cancel.component';
import { LeadCancelConfirmComponent } from './lead-cancel/lead-cancel-confirm/lead-cancel-confirm.component'; 
import { LeadViewComponent } from './lead-view/lead-view.component';
import { ViewCustomerDataComponent } from './lead-view/view-customer-data/view-customer-data.component';
import { ViewLeadDataComponent } from './lead-view/view-lead-data/view-lead-data.component'; 
import { FraudVerifPagingComponent } from './fraud-verif/fraud-verif-paging/fraud-verif-paging.component';
import { FraudVerifPageComponent } from './fraud-verif/fraud-verif-page/fraud-verif-page.component';
import { LeadInquiryComponent } from './lead-inquiry/lead-inquiry.component';
import { TeleVerifPagingComponent } from './tele-verif/tele-verif-paging/tele-verif-paging.component';
import { TeleVerifDetailComponent } from './tele-verif/tele-verif-detail/tele-verif-detail.component';
import { LeadInputLeadDataComponent } from "./lead-input/lead-input-lead-data/lead-input-lead-data.component";
import { MatRadioModule } from "@angular/material";
import { LeadUpdateComponent } from "./lead-update/lead-update.component";
import { LeadUpdatePageComponent } from "./lead-update/lead-update-page/lead-update-page.component";
import { LeadUpdateMainInfoComponent } from "./lead-update/lead-update-main-info/lead-update-main-info.component";
import { LeadUpdateCustDataComponent } from "./lead-update/lead-update-cust-data/lead-update-cust-data.component";
import { LeadUpdateLeadDataComponent } from "./lead-update/lead-update-lead-data/lead-update-lead-data.component";
import { NgxCurrencyModule } from "ngx-currency";
import { CustJobDataComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/socmed/cust-socmed.component";
export const customCurrencyMaskConfig = {     
  align: "left",     
  allowNegative: true,     
  allowZero: true,     
  decimal: ".",     
  precision: 2,     
  prefix: "",     
  suffix: "",     
  thousands: ",",     
  nullable: false };

 

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
    ArchwizardModule,
    ReactiveFormsModule,
    UcaddressModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    UclookupgenericModule,
    UcviewgenericModule,
    SharingComponentModule,
    ArchwizardModule,
    MatRadioModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    // MainInfoComponent,
    CustJobDataComponent,
    CustSocmedComponent,
    LeadMainInfoComponent,
    CustomerSelfVerificationComponent,
    CustomerDataComponent,
    LeadDataComponent, 
    LeadDataComponent,
    LeadVerifComponent,
    LeadCancelComponent,
    LeadCancelConfirmComponent, 
    LeadViewComponent,
    ViewCustomerDataComponent,
    ViewLeadDataComponent, 
    FraudVerifPagingComponent, FraudVerifPageComponent, LeadInquiryComponent, 
    LeadInputComponent,
    LeadInputCustDataComponent,
    LeadInputPageComponent,
    LeadInputMainInfoComponent,
    LeadViewHeaderComponent,
    TeleVerifPagingComponent,
    TeleVerifDetailComponent,
    LeadInputLeadDataComponent,
    LeadViewHeaderComponent,
    LeadUpdateComponent,
    LeadUpdatePageComponent,
    LeadUpdateMainInfoComponent,
    LeadUpdateCustDataComponent,
    LeadUpdateLeadDataComponent,
    // ArchwizardModule, 
    ViewLeadDataComponent, 
    FraudVerifPagingComponent, 
    FraudVerifPageComponent, 
    LeadInquiryComponent, 
  ],
})

export class LeadModule { }