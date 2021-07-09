import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ArchwizardModule } from "angular-archwizard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { CreditProcessSharingRoutingModule } from "./credit-process-routing.module";
import { PhoneVerificationPagingComponent } from "./phone-verification/phone-verification-paging/phone-verification-paging.component";
import { PhoneVerificationSubjectComponent } from "./phone-verification/phone-verification-subject/phone-verification-subject.component";
import { PhoneVerificationSubjectViewComponent } from "./phone-verification/phone-verification-subject-view/phone-verification-subject-view.component";
import { PhoneVerificationSubjectVerifComponent } from "./phone-verification/phone-verification-subject-verif/phone-verification-subject-verif.component";
import { CommissionReservedFundPagingComponent } from "./commission-reserved-fund/comission-reserved-fund-paging/commission-reserved-fund-paging.component";
import { ReservedFundComponent } from "./commission-reserved-fund/component/reserved-fund/reserved-fund.component";
import { CommissionReservedFundDetailComponent } from "./commission-reserved-fund/comission-reserved-fund-detail/commission-reserved-fund-detail.component";
import { UcapprovalModule } from "@adins/ucapproval";
import { UcapprovebyModule } from "@adins/ucapproveby";
import { CreditInquiryComponent } from './credit-inquiry/credit-inquiry.component';
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ViewSharingComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-sharing-component.module";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { ViewMainInfoComponentModule } from "app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module";
import { CommissionV2Component } from './commission-reserved-fund/component/commission-v2/commission-v2.component';
import { FormCommissionGenerateComponent } from './commission-reserved-fund/component/commission-v2/form-commission-generate/form-commission-generate.component';
import { CommissionCfnaComponent } from './commission-reserved-fund/component/commission-cfna/commission-cfna.component';
import { CreditReviewComponent } from "./credit-review-prototype/credit-review-paging/credit-review-paging.component";
import { CreditReviewDetailPersonalComponent } from "./credit-review-prototype/credit-review-detail-personal/credit-review-detail-personal.component";
import { SharedModule } from "app/shared/shared.module";
import { CreditReviewCrDetailComponent } from './credit-review-cr/credit-review-cr-detail/credit-review-cr-detail.component';
import { CreditReviewCrPagingComponent } from './credit-review-cr/credit-review-cr-paging/credit-review-cr-paging.component';
import { CreditReviewComponentModule } from "app/NEW-NAP/sharing-component/credit-review-component/credit-review-component.module";;
import { CreditApprovalCrDetailComponent } from './credit-approval-cr/credit-approval-cr-detail/credit-approval-cr-detail.component';
import { CreditApprovalCrPagingComponent } from './credit-approval-cr/credit-approval-cr-paging/credit-approval-cr-paging.component';
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { CreditReviewMainComponent } from "./credit-review/credit-review-main/credit-review-main.component";
import { CreditReviewPagingComponent } from "./credit-review/credit-review-paging/credit-review-paging.component";
import { CreditReviewCfnaDetailComponent } from './credit-review-cfna/credit-review-cfna-detail/credit-review-cfna-detail.component';
import { CreditReviewCfnaPagingComponent } from './credit-review-cfna/credit-review-cfna-paging/credit-review-cfna-paging.component';
import { CreditApprovalDetailComponent } from './credit-approval/credit-approval-detail/credit-approval-detail.component';
import { CreditApprovalPagingComponent } from './credit-approval/credit-approval-paging/credit-approval-paging.component';
import { CreditApprovalCfnaPagingComponent } from './credit-approval-cfna/credit-approval-cfna-paging/credit-approval-cfna-paging.component';
import { CreditApprovalCfnaDetailComponent } from './credit-approval-cfna/credit-approval-cfna-detail/credit-approval-cfna-detail.component';
import { CustHistoryComponent } from './credit-investigation/component/cust-history/cust-history.component';
import { TabApplicationDataComponent } from './credit-investigation/component/tab-application-data/tab-application-data.component';
import { ViewApplicationDataMultiComponent } from './credit-investigation/component/view-application-data-multi/view-application-data-multi.component';
import { CreditReviewPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-dsf/credit-review-paging-dsf/credit-review-paging-dsf.component";
import { CreditReviewCfnaPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-cfna-dsf/credit-review-cfna-paging-dsf/credit-review-cfna-paging-dsf.component";
import { CreditReviewDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-dsf/credit-review-detail-dsf/credit-review-detail-dsf.component";


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
  exports: [
  ],
  imports: [
    CommonModule,
    CreditProcessSharingRoutingModule,
    AdInsModule,
    ProcessComponentModule,
    ArchwizardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    UcapprovalModule,
    UcapprovebyModule,
    UcSubsectionModule ,
    ViewSharingComponentModule,
    UcviewgenericModule,
    ViewAppComponentModule,
    ViewMainInfoComponentModule,
    SharedModule,
    CreditReviewComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    UcapprovalcreateModule,
    UcapprovalHistoryModule,
    UcapprovalR3Module,
    UcapprovalgeneralinfoModule
  ],
  declarations: [
    PhoneVerificationPagingComponent,
    PhoneVerificationSubjectComponent,
    PhoneVerificationSubjectViewComponent,
    PhoneVerificationSubjectVerifComponent,
    CommissionReservedFundPagingComponent,
    CommissionReservedFundDetailComponent,
    ReservedFundComponent,
    CreditInquiryComponent, 
    CommissionV2Component,
    FormCommissionGenerateComponent,
    CommissionCfnaComponent,
    CreditReviewComponent,
    CreditReviewDetailPersonalComponent,
    CreditReviewCrDetailComponent,
    CreditReviewCrPagingComponent,
    CreditApprovalCrDetailComponent,
    CreditApprovalCrPagingComponent,
    CreditReviewPagingComponent,
    CreditReviewMainComponent,
    CreditReviewCfnaDetailComponent,
    CreditReviewCfnaPagingComponent,
    CreditApprovalDetailComponent,
    CreditApprovalPagingComponent,
    CreditApprovalCfnaPagingComponent,
    CreditApprovalCfnaDetailComponent,
    CustHistoryComponent,
    TabApplicationDataComponent,
    ViewApplicationDataMultiComponent,
    CreditReviewPagingDsfComponent,
    CreditReviewCfnaPagingDsfComponent,
    CreditReviewDetailDsfComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessSharingModule { }
