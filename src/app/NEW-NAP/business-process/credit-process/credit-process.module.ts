import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ArchwizardModule } from "angular-archwizard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatDividerModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
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
import { CreditReviewPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-dsf/credit-review-paging-dsf/credit-review-paging-dsf.component";
import { CreditReviewCfnaPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-cfna-dsf/credit-review-cfna-paging-dsf/credit-review-cfna-paging-dsf.component";
import { CreditReviewDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-dsf/credit-review-detail-dsf/credit-review-detail-dsf.component";
import { CreditApprovalDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-dsf/credit-approval-detail-dsf/credit-approval-detail-dsf.component";
import { CreditApprovalPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-dsf/credit-approval-paging-dsf/credit-approval-paging-dsf.component";
import { CreditApprovalCfnaPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-cfna-dsf/credit-approval-cfna-paging-dsf/credit-approval-cfna-paging-dsf.component";
import { CreditApprovalCfnaDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-cfna-dsf/credit-approval-cfna-detail-dsf/credit-approval-cfna-detail-dsf.component";
import { TabApplicationDataComponent } from "./shared-component/tab-application-data/tab-application-data.component";
import { ViewApplicationDataMultiComponent } from "./shared-component/view-application-data-multi/view-application-data-multi.component";
import { CreditReviewCfnaDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-cfna-dsf/credit-review-cfna-detail-dsf/credit-review-cfna-detail-dsf.component";

import { ComissionReservedFundDetailXComponent } from "app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/comission-reserved-fund-detail-x/comission-reserved-fund-detail-x.component";
import { CommissionV2XComponent } from "app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/component/commission-v2-x/commission-v2-x.component";
import { ReservedFundXComponent } from "app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/component/reserved-fund-x/reserved-fund-x.component";
import { ComissionReservedFundPagingXComponent } from "app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/comission-reserved-fund-paging-x/comission-reserved-fund-paging-x.component";
import { FormCommissionGenerateXComponent } from "app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/component/commission-v2-x/form-commission-generate-x/form-commission-generate-x.component";
import { CreditReviewCrPagingXComponent } from "app/impl/NEW-NAP/business-process/credit-process/credit-review-cr/credit-review-cr-paging/credit-review-cr-paging-x.component";
import { CreditReviewCrDetailXComponent } from "app/impl/NEW-NAP/business-process/credit-process/credit-review-cr/credit-review-cr-detail/credit-review-cr-detail-x.component";
import { CreditApprovalCrDetailXComponent } from "app/impl/NEW-NAP/business-process/credit-process/credit-approval-cr/credit-approval-cr-detail/credit-approval-cr-detail-x.component";
import { SurveyPagingXComponent } from "app/impl/NEW-NAP/business-process/credit-process/survey/survey-paging-x/survey-paging-x.component";
import { SurveySubjectXComponent } from "app/impl/NEW-NAP/business-process/credit-process/survey/survey-subject-x/survey-subject-x.component";
import { SurveySubjectVerifXComponent } from "app/impl/NEW-NAP/business-process/credit-process/survey/survey-subject-verif-x/survey-subject-verif-x.component";
import { SurveySubjectViewXComponent } from "app/impl/NEW-NAP/business-process/credit-process/survey/survey-subject-view-x/survey-subject-view-x.component";
// import { CustHistoryComponent } from "app/NEW-NAP/sharing-component/process-component/cust-history/cust-history.component";
import { CreditReviewPagingXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-x-dsf/credit-review-paging-x-dsf/credit-review-paging-x-dsf.component";
import { CreditReviewDetailXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-x-dsf/credit-review-detail-x-dsf/credit-review-detail-x-dsf.component";
import { CreditApprovalDetailXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-x-dsf/credit-approval-detail-x-dsf/credit-approval-detail-x-dsf.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { CommissionV3Component } from "./commission-reserved-fund/component/commission-v3/commission-v3.component";
import { FormCommissionGenerateV2Component } from "./commission-reserved-fund/component/commission-v3/form-commission-generate-v2/form-commission-generate-v2.component";
import { CrdRvwViewModule } from "app/view-enhancing/crd-rvw-view/crd-rvw-view.module";


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
  exports: [
    CreditReviewComponent,
    CreditReviewDetailPersonalComponent,
    CreditReviewCrDetailComponent,
    CreditReviewCrPagingComponent,
    CreditReviewPagingComponent,
    CreditReviewMainComponent,
    CreditReviewCfnaDetailComponent,
    CreditReviewCfnaPagingComponent
  ],
  imports: [
    CommonModule,
    CreditProcessSharingRoutingModule,
    AdInsModule,
    AdInsSharedModule,
    ProcessComponentModule,
    ArchwizardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    MatTabsModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    UcapprovalModule,
    UcapprovebyModule,
    UcSubsectionModule,
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
    UcapprovalgeneralinfoModule,
    CrdRvwViewModule
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
    CommissionV3Component,
    FormCommissionGenerateComponent,
    FormCommissionGenerateV2Component,
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
    TabApplicationDataComponent,
    ViewApplicationDataMultiComponent,
    // CustHistoryComponent,
    CreditReviewPagingDsfComponent,
    CreditReviewCfnaPagingDsfComponent,
    CreditReviewDetailDsfComponent,
    CreditReviewCfnaDetailDsfComponent,
    CreditApprovalDetailDsfComponent,
    CreditApprovalPagingDsfComponent,
    CreditApprovalCfnaPagingDsfComponent,
    CreditApprovalCfnaDetailDsfComponent,
    ComissionReservedFundPagingXComponent,
    ComissionReservedFundDetailXComponent,
    CommissionV2XComponent,
    ReservedFundXComponent,
    FormCommissionGenerateXComponent,
    CreditReviewCrPagingXComponent,
    CreditReviewCrDetailXComponent,
    CreditApprovalCrDetailXComponent,
    SurveyPagingXComponent,
    SurveySubjectXComponent,
    SurveySubjectVerifXComponent,
    SurveySubjectViewXComponent,
    CreditReviewDetailXDsfComponent,
    CreditReviewPagingXDsfComponent,
    CreditApprovalDetailXDsfComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessSharingModule { }
