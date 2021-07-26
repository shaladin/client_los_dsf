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
import { MatRadioModule, MatTabsModule } from "@angular/material";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { CustSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/cust-sharing-component.module";
import { UcuploadModule } from "@adins/ucupload";
import { UcaddtotempModule } from "@adins/ucaddtotemp";
import { LtkmRoutingModule } from "./ltkm-routing.module";
import { LtkmRequestAnalysisComponent } from "./ltkm-request/ltkm-request-analysis.component";
import { LtkmRequestComponent } from "./ltkm-request/ltkm-request.component";
import { CustPersonalMainDataComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/personal-main-data/cust-personal-main-data.component";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { LtkmVerifyDetailComponent } from "./ltkm-verify/detail/ltkm-verify-detail.component";
import { LtkmVerifyPagingComponent } from "./ltkm-verify/paging/ltkm-verify-paging.component";
import { LtkmApprovalPagingComponent } from "./ltkm-approval/paging/ltkm-approval-paging.component";
import { LtkmApprovalDetailComponent } from "./ltkm-approval/detail/ltkm-approval-detail.component";
import { LtkMainInfoComponent } from "./ltkm-mi/ltkm-mi.component";
import { ViewLtkmComponentModule } from "app/ltkm/view-ltkm-component/view-ltkm-component.module";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { LtkmOtherInfoComponent } from "./ltkm-request/additional-component/other-info/other-info.component";
import { AttrContentComponentComponent } from "app/NEW-NAP/sharing-component/cust-completion-component/attr-content-component/attr-content-component.component";
import { LtkmEmergencyContactComponent } from "./ltkm-request/additional-component/emergency-contact/emergency-contact.component";
import { LtkmFinancialPersonalComponent } from "./ltkm-request/additional-component/financial-personal/financial-personal.component";
import { LtkmCustJobDataComponent } from "./ltkm-request/additional-component/cust-job-data/cust-job-data.component";
import { LtkmCustGrpMemberComponent } from "./ltkm-request/additional-component/cust-grp-member/cust-grp-member.component";
import { LtkmAttrContentComponentComponent } from "./ltkm-request/additional-component/attr-content/attr-content-component.component";
import { LtkmBankSectionComponent } from "./ltkm-request/additional-component/bank-section/bank-section.component";
import { LtkmReturnHandlingPagingComponent } from "./ltkm-return-handling/paging/ltkm-return-handling.component";
import { LtkmReturnHandlingComponent } from "./ltkm-return-handling/detail/ltkm-return-handling.component";
import { LtkmCustPersonalMainDataComponent } from "./ltkm-request/additional-component/cust-personal-main-data/cust-personal-main-data.component";
import { LtkmMgmntShrholderComponent } from "./ltkm-request/additional-component/company/mgmnt-shrholder/mgmnt-shrholder.component";
import { LtkmLegalDocComponent } from "./ltkm-request/additional-component/company/legal-doc-tab/legal-doc.component";
import { LtkmFinancialCompanyComponent } from "./ltkm-request/additional-component/company/financial-company/financial-company.component";
import { LtkmCustCompanyMainDataComponent } from "./ltkm-request/additional-component/company/cust-company-main-data/cust-company-main-data.component";
import { LtkmCcContactInformationTabComponent } from "./ltkm-request/additional-component/company/cc-contact-information-tab/cc-contact-information.component";
import { UcgridviewModule } from "@adins/ucgridview";
import { LtkmInquiryComponent } from "./ltkm-inquiry/ltkm-inquiry.component";
import { LtkmViewComponent } from "./view-ltkm-component/ltkm-view-component";
import { LtkmFamilyMainDataPagingComponent } from "./ltkm-request/additional-component/family-main-data/family-main-data-paging.component";
import { ViewLtkmAppSummaryDataComponent } from "./view-ltkm-component/ltkm-app-summary-data/ltkm-app-summary-data.component";
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
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  imports: [
    LtkmRoutingModule,
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
    InputNapComponentModule,
    ViewLtkmComponentModule,
    MatTabsModule,
    UcapprovalcreateModule,
    UcapprovalHistoryModule,
    UcapprovalR3Module,
    UcapprovalgeneralinfoModule,
    UcgridviewModule
  ],
  declarations: [
    LtkmRequestAnalysisComponent,
    LtkmRequestComponent,
    LtkmVerifyPagingComponent,
    LtkmVerifyDetailComponent,
    LtkmApprovalPagingComponent,
    LtkmApprovalDetailComponent,
    LtkMainInfoComponent,
    LtkmOtherInfoComponent,
    LtkmEmergencyContactComponent,
    LtkmFinancialPersonalComponent,
    LtkmCustJobDataComponent,
    LtkmCustGrpMemberComponent,
    LtkmAttrContentComponentComponent,
    LtkmBankSectionComponent,
    LtkmReturnHandlingPagingComponent,
    LtkmReturnHandlingComponent,
    LtkmCustPersonalMainDataComponent,
    LtkmMgmntShrholderComponent,
    LtkmLegalDocComponent,
    LtkmFinancialCompanyComponent,
    LtkmCustCompanyMainDataComponent,
    LtkmCcContactInformationTabComponent,
    LtkmInquiryComponent,
    LtkmFamilyMainDataPagingComponent
  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent,
    LtkMainInfoComponent
  ]
})

export class LtkmModule { }