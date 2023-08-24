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
import { MatCheckboxModule, MatRadioModule, MatTabsModule } from "@angular/material";
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
import { AppCancelDetailComponent } from "./app-cancel/detail/app-cancel-detail.component";
import { AppAssetCancelDetailComponent } from "./app-asset-cancel/detail/app-asset-cancel-detail.component";
import { AppCancelPagingComponent } from "./app-cancel/paging/app-cancel-paging.component";
import { AppAssetCancelPagingComponent } from "./app-asset-cancel/paging/app-asset-cancel-paging.component";
import { DocPickupRequestPagingComponent } from './doc-pickup-request/doc-pickup-request-paging/doc-pickup-request-paging/doc-pickup-request-paging.component';
import { DocPickupRequestDetailComponent } from './doc-pickup-request/doc-pickup-request-detail/doc-pickup-request-detail/doc-pickup-request-detail.component';
import { EditAppAfterApprovalPagingComponent } from "./edit-app-after-approval/edit-app-after-approval-paging/edit-app-after-approval-paging.component";
import { EditAppAfterApprovalDetailComponent } from "./edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-detail.component";
import { EditAppAfterApprovalAssetDataComponent } from "./edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-asset-data/edit-app-after-approval-asset-data.component";
import { EditAppAfterApprovalAssetDataXComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-asset-data-x/edit-app-after-approval-asset-data-x.component";
import { EditAppAfterApprovalPurchaseOrderDataComponent } from "./edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-purchase-order-data/edit-app-after-approval-purchase-order-data.component";
import { CreditApprovalResultExtensionApprovalDetailComponent } from "./credit-apv-result-ext/approval/detail/detail.component";
import { CreditApprovalResultExtensionApprovalPagingComponent } from "./credit-apv-result-ext/approval/paging/paging.component";
import { CopyCanAppMultiBlComponent } from "./copy-can-app-multi-bl/copy-can-app-multi-bl.component";
import { CopyCanAppMultiBlDetailComponent } from "./copy-can-app-multi-bl-detail/copy-can-app-multi-bl-detail.component";
import { EditAppAfterApprovalApprovalPagingComponent } from "./edit-app-after-approval/edit-app-after-approval-approval-paging/edit-app-after-approval-approval-paging.component";
import { EditAppAfterApprovalApprovalDetailComponent } from "./edit-app-after-approval/edit-app-after-approval-approval-detail/edit-app-after-approval-approval-detail.component";
import { EditAppAfterApprovalInquiryComponent } from "./edit-app-after-approval-inquiry/edit-app-after-approval-inquiry.component";
import { EditAppAfterApprovalViewComponent } from "./edit-app-after-approval-view/edit-app-after-approval-view.component";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ReturnHandlingSurveyVerifXComponent } from "app/impl/NEW-NAP/business-process/additional-process/return-handling/return-handling-survey-verif-x/return-handling-survey-verif-x.component";
import { CopyCancelledApplicationXComponent } from "app/impl/NEW-NAP/business-process/additional-process/copy-cancelled-application-x/copy-cancelled-application-x.component";
import { CopyCanAppMultiBlDetailXComponent } from "app/impl/NEW-NAP/business-process/additional-process/copy-can-app-multi-bl-detail/copy-can-app-multi-bl-detail-x.component";
import { ReturnHandlingPagingXComponent } from "app/impl/NEW-NAP/business-process/additional-process/return-handling/return-handling-paging-x/return-handling-paging-x.component";
import { ReturnHandlingDetailXComponent } from "app/impl/NEW-NAP/business-process/additional-process/return-handling/return-handling-detail-x/return-handling-detail-x.component";
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { EditAppAfterApprovalDetailXComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-detail-x.component";
import { EditAppAfterApprovalPurchaseOrderDataXComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-purchase-order-data/edit-app-after-approval-purchase-order-data-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { CustSyncComponent } from '../../../impl/NEW-NAP/business-process/additional-process/cust-sync/cust-sync.component';
import { EditNapCustPagingComponent } from "./edit-nap-cust/edit-nap-cust-paging/edit-nap-cust-paging.component";
import { EditNapCustDetailComponent } from "./edit-nap-cust/edit-nap-cust-detail/edit-nap-cust-detail.component";
import { MainDataComponentModule } from "app/NEW-NAP/sharing-component/main-data-component/main-data-component.module";
import { EditAppAfterApprovalBankAccComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval/edit-app-after-approval-detail/edit-app-after-approval-bank-acc/edit-app-after-approval-bank-acc.component";
import { EditAppAfterApprovalViewXComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval-view-x/edit-app-after-approval-view-x.component";
import { EditAppAfterApprovalApprovalDetailXComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval/edit-app-after-approval-approval-detail-x/edit-app-after-approval-approval-detail-x.component";
import { EditAppAfterApprovalPagingXComponent } from "app/impl/NEW-NAP/business-process/additional-process/edit-app-after-approval/edit-app-after-approval-paging-x/edit-app-after-approval-paging-x.component";
import { AutoDebitRegistrationPagingComponent } from "app/impl/NEW-NAP/business-process/additional-process/auto-debit-registration/auto-debit-registration-paging/auto-debit-registration-paging.component";
import { AutoDebitRegistrationInquiryComponent } from "app/impl/NEW-NAP/business-process/additional-process/auto-debit-registration/auto-debit-registration-inquiry/auto-debit-registration-inquiry.component";
import { AutoDebitRegistrationCancelComponent } from "app/impl/NEW-NAP/business-process/additional-process/auto-debit-registration/auto-debit-registration-cancel/auto-debit-registration-cancel.component";
import { AutoDebitTestComponent } from "app/impl/NEW-NAP/business-process/additional-process/auto-debit-registration/auto-debit-registration-paging/auto-debit-test.component";
import { ReturnHandlingNewEditAppPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/additional-process-dsf/return-handling-dsf/return-handling-new-edit-app-paging-dsf/return-handling-new-edit-app-paging-dsf.component";
import { ReturnHandlingPagingXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/additional-process-dsf/return-handling-dsf/return-handling-paging-x-dsf/return-handling-paging-x-dsf.component";
import { ReturnHandlingDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/additional-process-dsf/return-handling-dsf/return-handling-detail-dsf/return-handling-detail-dsf.component";
import { ReturnHandlingEditNap4DsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/additional-process-dsf/return-handling-dsf/return-handling-edit-nap4-dsf/return-handling-edit-nap4-dsf.component";


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
    CommonModule,
    AdditionalProcessSharingRoutingModule,
    AdInsModule,
    AdInsSharedModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule,
    MatCheckboxModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ViewAppComponentModule,
    SharedModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule,
    MatTabsModule,
    InputNapComponentModule,
    ProcessComponentModule,
    MatRadioModule,
    MainDataComponentModule
  ],
  declarations: [
    CreditApvResultExtPagingComponent,
    CreditApvResultExtDetailComponent,
    OutstandingTcPagingComponent,
    OutstandingTcDetailComponent,
    ReturnHandlingPagingComponent,
    ReturnHandlingPagingXDsfComponent,
    ReturnHandlingDetailComponent,
    ReturnHandlingDetailDsfComponent,
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
    ReturnHandlingEditNap4DsfComponent,
    ReturnHandlingNewEditAppPagingComponent,
    ReturnHandlingNewEditAppPagingDsfComponent,
    AdditionalTcPagingComponent,
    AdditionalTcDetailComponent,
    ReturnHandlingEditCustPagingComponent,
    AppCancelPagingComponent,
    AppCancelDetailComponent,
    AppAssetCancelPagingComponent,
    AppAssetCancelDetailComponent,
    DocPickupRequestPagingComponent,
    DocPickupRequestDetailComponent,
    EditAppAfterApprovalPagingComponent,
    EditAppAfterApprovalDetailComponent,
    EditAppAfterApprovalAssetDataComponent,
    EditAppAfterApprovalAssetDataXComponent,
    EditAppAfterApprovalPurchaseOrderDataComponent,
    CreditApprovalResultExtensionApprovalDetailComponent,
    CreditApprovalResultExtensionApprovalPagingComponent,
    CopyCanAppMultiBlComponent,
    CopyCanAppMultiBlDetailComponent,
    EditAppAfterApprovalApprovalPagingComponent,
    EditAppAfterApprovalApprovalDetailComponent,
    EditAppAfterApprovalInquiryComponent,
    EditAppAfterApprovalViewComponent,
    ReturnHandlingSurveyVerifXComponent,
    CopyCancelledApplicationXComponent,
    CopyCanAppMultiBlDetailXComponent,
    ReturnHandlingPagingXComponent,
    ReturnHandlingDetailXComponent,
    EditAppAfterApprovalDetailXComponent,
    EditAppAfterApprovalPurchaseOrderDataXComponent,
    CustSyncComponent,
    EditNapCustPagingComponent,
    EditNapCustDetailComponent,
    EditAppAfterApprovalBankAccComponent,
    EditAppAfterApprovalViewXComponent,
    EditAppAfterApprovalApprovalDetailXComponent,
    EditAppAfterApprovalPagingXComponent,
    AutoDebitRegistrationPagingComponent,
    AutoDebitRegistrationInquiryComponent,
    AutoDebitRegistrationCancelComponent,
    AutoDebitTestComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdditionalProcessSharingModule { }
