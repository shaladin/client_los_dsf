import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ArchwizardModule } from "angular-archwizard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
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
import { ViewAppCustDataPersonalComponent } from "./credit-investigation/component/view-app-cust-data-personal/view-app-cust-data-personal.component";
import { ViewAppCustDataCompanyComponent } from "./credit-investigation/component/view-app-cust-data-company/view-app-cust-data-company.component";
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
import { TabDeviationComponent } from "./credit-investigation/component/tab-deviation/tab-deviation.component";
import { CreditReviewPagingComponent } from "./credit-review/credit-review-paging/credit-review-paging.component";
import { CreditReviewMainComponent } from "./credit-review/credit-review-main/credit-review-main.component";

@NgModule({
  imports: [
    CommonModule,
    CreditProcessSharingRoutingModule,
    AdInsModule,
    ArchwizardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
  ],
  declarations: [
    CreditApprovalPagingComponent,
    PhoneVerificationPagingComponent,
    PhoneVerificationSubjectComponent,
    PhoneVerificationSubjectViewComponent,
    PhoneVerificationSubjectVerifComponent,
    CreditInvestigationDetailComponent,
    CreditInvestigationPagingComponent,
    ViewAppCustDataPersonalComponent,
    ViewAppCustDataCompanyComponent,
    TabApplicationDataComponent,
    TabDeviationComponent,
    ViewFraudDetectionResultComponent,
    ViewSurveyTaskListComponent,
    CustHistoryComponent,
    ViewApprovalComponent,
    CommissionReservedFundPagingComponent,
    CommissionReservedFundDetailComponent,
    CommissionComponent,
    ReservedFundComponent,
    FormAddDynamicComponent,
    FraudDetectionPagingComponent,
    FraudDetectionVerifComponent,
    CreditReviewPagingComponent,
    CreditReviewMainComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessSharingModule { }