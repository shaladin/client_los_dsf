import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdditionalProcessSharingRoutingModule } from "./additional-process-routing.module";
import { TcSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/tc-sharing-component.module"
import { OutstandingTcPagingComponent } from "./outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component";
import { OutstandingTcDetailComponent } from "./outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component";
import { ReturnHandlingPagingComponent } from "./return-handling/return-handling-paging/return-handling-paging.component";
import { ReturnHandlingDetailComponent } from "./return-handling/return-handling-detail/return-handling-detail.component";
import { ViewMainInfoComponentModule } from "app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module"
import { PagingComponent } from "./app-dup-check/paging/paging.component";
import { ListPersonalComponent } from "./app-dup-check/list-personal/list-personal.component";
import { ListCompanyComponent } from "./app-dup-check/list-company/list-company.component";
import { ApplicantExistingDataPersonalComponent } from "./app-dup-check/applicant-existing-data-personal/applicant-existing-data-personal.component";
import { ApplicantExistingDataCompanyComponent } from "./app-dup-check/applicant-existing-data-company/applicant-existing-data-company.component";
import { ReturnHandlingEditAppPagingComponent } from './return-handling/return-handling-edit-app-paging/return-handling-edit-app-paging.component';
import { AppInquiryComponent } from './app-inquiry/app-inquiry.component';
import { CreditProcessInquiryComponent } from './credit-process-inquiry/credit-process-inquiry.component';
import { ReturnHandlingPhoneVerifPagingComponent } from "./return-handling/return-handling-phone-verif-paging/return-handling-phone-verif-paging.component";
import { ReturnHandlingSurveyComponent } from './return-handling/return-handling-survey/return-handling-survey.component';
import { ReturnHandlingCollateralDetailComponent } from "./return-handling/return-handling-collateral-detail/return-handling-collateral-detail.component";
import { ReturnHandlingCollateralEditComponent } from "./return-handling/return-handling-collateral-edit/return-handling-collateral-edit.component";
import { ReturnHandlingCollateralPagingComponent } from "./return-handling/return-handling-collateral-paging/return-handling-collateral-paging.component";
import { MatCheckboxModule, MatTabsModule } from "@angular/material";
import { ReturnHandlingComRsvfundPagingComponent } from "./return-handling/return-handling-com-rsvfund-paging/return-handling-com-rsvfund-paging.component";
import { CopyCancelledApplicationComponent } from './copy-cancelled-application/copy-cancelled-application.component';
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { CreditApvResultExtDetailComponent } from "./credit-apv-result-ext/credit-apv-result-ext-detail/credit-apv-result-ext-detail.component";
import { CreditApvResultExtPagingComponent } from "./credit-apv-result-ext/credit-apv-result-ext-paging/credit-apv-result-ext-paging.component";
import { AssetInquiryComponent } from "./credit-apv-result-ext/asset-inquiry/asset-inquiry.component";
import { ReturnHandlingAdditionalTcPagingComponent } from './return-handling/return-handling-additional-tc-paging/return-handling-additional-tc-paging.component';
import { ReturnHandlingAdditionalTcDetailComponent } from './return-handling/return-handling-additional-tc-detail/return-handling-additional-tc-detail.component';
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { DupCheckMdPagingComponent } from "./app-dup-check-main-data/dup-check-md-paging/dup-check-md-paging.component";
import { DupCheckMdSubjListComponent } from "./app-dup-check-main-data/dup-check-md-subj-list/dup-check-md-subj-list.component";
import { DupCheckMdSubjMatchComponent } from "./app-dup-check-main-data/dup-check-md-subj-match/dup-check-md-subj-match.component";
import { SharedModule } from "app/shared/shared.module";
import { ReturnHandlingEditNap4Component } from './return-handling/return-handling-edit-nap4/return-handling-edit-nap4.component';
import { ReturnHandlingNewEditAppPagingComponent } from './return-handling/return-handling-new-edit-app-paging/return-handling-new-edit-app-paging.component';
import { AdditionalTcPagingComponent } from './additional-tc/additional-tc-paging/additional-tc-paging.component';
import { AdditionalTcDetailComponent } from './additional-tc/additional-tc-detail/additional-tc-detail.component';
import { ReturnHandlingEditCustPagingComponent } from './return-handling/return-handling-edit-cust-paging/return-handling-edit-cust-paging.component';

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
    CommonModule,
    AdditionalProcessSharingRoutingModule,
    AdInsModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule,
    MatCheckboxModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ViewAppComponentModule,
    SharedModule,
    MatTabsModule
  ],
  declarations: [
    CreditApvResultExtPagingComponent,
    CreditApvResultExtDetailComponent,
    OutstandingTcPagingComponent,
    OutstandingTcDetailComponent,
    ReturnHandlingPagingComponent,
    ReturnHandlingDetailComponent,
    PagingComponent,
    ListPersonalComponent,
    ListCompanyComponent,
    ApplicantExistingDataPersonalComponent,
    ApplicantExistingDataCompanyComponent,
    ReturnHandlingEditAppPagingComponent,
    AssetInquiryComponent,
    ReturnHandlingComRsvfundPagingComponent,
    AppInquiryComponent,
    CreditProcessInquiryComponent,
    ReturnHandlingPhoneVerifPagingComponent,
    ReturnHandlingSurveyComponent,
    ReturnHandlingCollateralPagingComponent,
    ReturnHandlingCollateralEditComponent,
    ReturnHandlingCollateralDetailComponent,
    CopyCancelledApplicationComponent,
    ReturnHandlingAdditionalTcPagingComponent,
    ReturnHandlingAdditionalTcDetailComponent,
    DupCheckMdPagingComponent,
    DupCheckMdSubjListComponent,
    DupCheckMdSubjMatchComponent,
    ReturnHandlingEditNap4Component,
    ReturnHandlingNewEditAppPagingComponent,
    AdditionalTcPagingComponent,
    AdditionalTcDetailComponent,
    ReturnHandlingEditCustPagingComponent,
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdditionalProcessSharingModule { }
