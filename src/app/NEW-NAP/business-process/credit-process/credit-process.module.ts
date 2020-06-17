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
import { CreditApprovalPagingComponent } from './credit-approval/credit-approval-paging/credit-approval-paging.component';
import { PhoneVerificationSubjectComponent } from "./phone-verification/phone-verification-subject/phone-verification-subject.component";
import { PhoneVerificationSubjectViewComponent } from "./phone-verification/phone-verification-subject-view/phone-verification-subject-view.component";
import { PhoneVerificationSubjectVerifComponent } from "./phone-verification/phone-verification-subject-verif/phone-verification-subject-verif.component";
import { CreditInvestigationDetailComponent } from "./credit-investigation/credit-investigation-detail/credit-investigation-detail.component";
import { CreditInvestigationPagingComponent } from "./credit-investigation/credit-investigation-paging/credit-investigation-paging.component";
import { TabApplicationDataComponent } from "./credit-investigation/component/tab-application-data/tab-application-data.component";
import { ViewFraudDetectionResultComponent } from "./credit-investigation/component/view-fraud-detection-result/view-fraud-detection-result.component";
import { ViewSurveyTaskListComponent } from "./credit-investigation/component/view-survey-task-list/view-survey-task-list.component";
import { CustHistoryComponent } from "./credit-investigation/component/cust-history/cust-history.component";
import { ViewApprovalComponent } from "./credit-investigation/component/cust-history/view-approval/view-approval.component";
import { FormAddDynamicComponent } from "./commission-reserved-fund/component/commission/form-add-dynamic/form-add-dynamic.component";
import { CommissionComponent } from "./commission-reserved-fund/component/commission/commission.component";
import { CommissionReservedFundPagingComponent } from "./commission-reserved-fund/comission-reserved-fund-paging/commission-reserved-fund-paging.component";
import { ReservedFundComponent } from "./commission-reserved-fund/component/reserved-fund/reserved-fund.component";
import { CommissionReservedFundDetailComponent } from "./commission-reserved-fund/comission-reserved-fund-detail/commission-reserved-fund-detail.component";
import { FraudDetectionPagingComponent } from "./fraud-detection/fraud-detection-paging/fraud-detection-paging.component";
import { FraudDetectionVerifComponent } from "./fraud-detection/fraud-detection-verif/fraud-detection-verif.component";
import { CreditReviewMainComponent } from "./credit-review/credit-review-main/credit-review-main.component";
import { CreditReviewPagingComponent } from "./credit-review/credit-review-paging/credit-review-paging.component";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { UcapprovalModule } from "@adins/ucapproval";
import { UcapprovebyModule } from "@adins/ucapproveby";
import { CreditInquiryComponent } from './credit-inquiry/credit-inquiry.component';
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { FraudVerificationMultiAssetComponent } from "./fraud-verification-multi-asset/fraud-verification-multi-asset.component";
import { ViewSharingComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-sharing-component.module";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { NgxCurrencyModule } from "ngx-currency";
import { CreditApprovalDetailComponent } from './credit-approval/credit-approval-detail/credit-approval-detail.component';
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { ViewAppFraudVerificationComponent } from "app/NEW-NAP/sharing-component/view-app-component/view-app-fraud-verification/view-app-fraud-verification.component";
import { ViewApplicationDataMultiComponent } from "./credit-investigation/component/view-application-data-multi/view-application-data-multi.component";
import { AppMainInfoComponent } from 'app/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info.component';


export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false
};

@NgModule({
  exports: [
    ViewFraudDetectionResultComponent,
    ViewAppFraudVerificationComponent
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
    UcinputnumberModule,
    UcapprovalModule,
    UcapprovebyModule,
    UcSubsectionModule ,
    ViewSharingComponentModule,
    UcviewgenericModule,
    ViewAppComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    CreditApprovalPagingComponent,
    PhoneVerificationPagingComponent,
    PhoneVerificationSubjectComponent,
    PhoneVerificationSubjectViewComponent,
    PhoneVerificationSubjectVerifComponent,
    CreditInvestigationDetailComponent,
    CreditInvestigationPagingComponent,
    TabApplicationDataComponent,
    CustHistoryComponent,
    CommissionReservedFundPagingComponent,
    CommissionReservedFundDetailComponent,
    CommissionComponent,
    ReservedFundComponent,
    FormAddDynamicComponent,
    FraudDetectionPagingComponent,
    FraudDetectionVerifComponent,
    CreditReviewMainComponent,
    CreditReviewPagingComponent,
    ViewFraudDetectionResultComponent,
    ViewSurveyTaskListComponent,
    ViewApprovalComponent,
    CreditReviewMainComponent,
    CreditInquiryComponent, 
    FraudVerificationMultiAssetComponent, 
    CreditApprovalDetailComponent,
    ViewAppFraudVerificationComponent,
    ViewApplicationDataMultiComponent,
    AppMainInfoComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessSharingModule { }
