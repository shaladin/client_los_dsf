import { NgModule } from "@angular/core";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { MouRoutingModule } from "./mou-routing.module";
import { DocSignerComponent } from "./doc-signer/doc-signer.component";
import { MouCustomerRequestComponent } from './mou-customer-request/mou-customer-request.component';
import { MouCustomerRequestDetailComponent } from './mou-customer-request/mou-customer-request-detail/mou-customer-request-detail.component';
import { MouCustomerDetailComponent } from "./mou-customer-request/mou-customer-detail/mou-customer-detail.component";
import { CustomerDocPrintingDetailComponent } from "./customer-doc-printing/customer-doc-printing-detail/customer-doc-printing-detail.component";
import { CustomerDocPrintingPagingComponent } from "./customer-doc-printing/customer-doc-printing-paging/customer-doc-printing-paging.component";
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouDetailGeneralComponent } from './mou-customer-request/mou-detail-general/mou-detail-general.component';
import { MouDetailFactoringComponent } from './mou-customer-request/mou-detail-factoring/mou-detail-factoring.component';
import { MouCustAssetComponent } from './mou-customer-request/mou-detail-general/mou-cust-asset/mou-cust-asset.component';
import { MouCustAssetDetailComponent } from './mou-customer-request/mou-detail-general/mou-cust-asset/mou-cust-asset-detail/mou-cust-asset-detail.component';
import { MouCustFeeComponent } from './mou-customer-request/mou-cust-fee/mou-cust-fee.component';
import { MouCustFeeDetailComponent } from './mou-customer-request/mou-cust-fee/mou-cust-fee-detail/mou-cust-fee-detail.component';
import { MouCustTcComponent } from './mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { MouCustListedCustFctrComponent } from './mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr.component';
import { MouCustListedCustFctrDetailComponent } from './mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr-detail/mou-cust-listed-cust-fctr-detail.component';
import { MouRequestAddcollComponent } from './mou-customer-request/mou-request-addcoll/mou-request-addcoll.component';
import { DocSignerDetailComponent } from "./doc-signer/doc-signer-detail/doc-signer-detail.component";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { EditMouCustomerComponent } from "./mou-customer/edit-mou-customer/edit-mou-customer.component";
import { MouCustomerApprovalComponent } from './mou-customer/mou-customer-approval/mou-customer-approval.component';
import { MouApprovalGeneralComponent } from './mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general.component';
import { MouApprovalFactoringComponent } from './mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring.component';
import { MouReviewFactoringComponent } from "./mou-customer/mou-review/mou-review-factoring/mou-review-factoring.component";
import { MouReviewGeneralComponent } from "./mou-customer/mou-review/mou-review-general/mou-review-general.component";
import { LegalReviewPagingComponent } from './legal-review/legal-review-paging/legal-review-paging.component';
import { LegalReviewDetailComponent } from './legal-review/legal-review-detail/legal-review-detail.component';
import { MouCustomerInquiryComponent } from './mou-customer/mou-customer-inquiry/mou-customer-inquiry.component';
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { TestUploadComponent } from './test-upload/test-upload.component';
import { MouCancelComponent } from "./mou-cancel/mou-cancel.component";
import { MouOsTcPagingComponent } from './mou-os-tc/mou-os-tc-paging/mou-os-tc-paging.component';
import { MouOsTcDetailComponent } from './mou-os-tc/mou-os-tc-detail/mou-os-tc-detail.component';
import { UnauthorizedPageComponent } from "./unauthorized-page/unauthorized-page.component";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatTabsModule } from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { MouExecutionPagingComponent } from './mou-execution/mou-execution-paging/mou-execution-paging.component';
import { MouExecutionDetailComponent } from './mou-execution/mou-execution-detail/mou-execution-detail.component';
import { MouCustTabComponent } from './mou-customer-request/mou-cust-tab/mou-cust-tab.component';
import { MouCustPersonalContactInfoComponent } from './mou-customer-request/mou-cust-tab/mou-cust-personal-contact-info/mou-cust-personal-contact-info.component';
import { MouCustPersonalFinancialComponent } from './mou-customer-request/mou-cust-tab/mou-cust-personal-financial/mou-cust-personal-financial.component';
import { MouCustBankAccComponent } from './mou-customer-request/mou-cust-tab/mou-cust-bank-acc/mou-cust-bank-acc.component';
import { MouCustJobDataComponent } from './mou-customer-request/mou-cust-tab/mou-cust-job-data/mou-cust-job-data.component';
import { MouCustSocmedComponent } from './mou-customer-request/mou-cust-tab/mou-cust-socmed/mou-cust-socmed.component';
import { MouCustGrpMbrComponent } from './mou-customer-request/mou-cust-tab/mou-cust-grp-mbr/mou-cust-grp-mbr.component';
import { MouCustPersonalMainComponent } from './mou-customer-request/mou-cust-tab/mou-cust-personal-main/mou-cust-personal-main.component';
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { MouCustCompanyContactInfoComponent } from './mou-customer-request/mou-cust-tab/mou-cust-company-contact-info/mou-cust-company-contact-info.component';
import { MouCustCompanyFinancialComponent } from './mou-customer-request/mou-cust-tab/mou-cust-company-financial/mou-cust-company-financial.component';
import { MouCustCompanyMainComponent } from './mou-customer-request/mou-cust-tab/mou-cust-company-main/mou-cust-company-main.component';
import { MouCustLegalDocComponent } from './mou-customer-request/mou-cust-tab/mou-cust-legal-doc/mou-cust-legal-doc.component';
import { MouCustMgmntShrholderComponent } from './mou-customer-request/mou-cust-tab/mou-cust-mgmnt-shrholder/mou-cust-mgmnt-shrholder.component';
import { SimilarMouPersonalDataComponent } from './mou-dup-check/similar-mou-personal-data/similar-mou-personal-data.component';
import { SimilarMouCompanyDataComponent } from './mou-dup-check/similar-mou-company-data/similar-mou-company-data.component';
import { MouDupCheckPagingComponent } from './mou-dup-check/mou-dup-check-paging/mou-dup-check-paging.component';
import { ExistingMouCompanyComponent } from './mou-dup-check/existing-mou-company/existing-mou-company.component';
import { ExistingMouPersonalComponent } from './mou-dup-check/existing-mou-personal/existing-mou-personal.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { MouViewComponentsModule } from "app/components/general/mou-view/mou-view.components.module";
import { UcapprovalcreateModule } from '@adins/ucapprovalcreate';
import { UcapprovalR3Module } from '@adins/ucapproval-r3';
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
 
import { SharedModule } from "app/shared/shared.module";

export const customCurrencyMaskConfig = {
  align: "left",
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
    NgbModule,
    RouterModule,
    AdInsModule,
    MouRoutingModule,
    SharingModule,
    ArchwizardModule,
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ReactiveFormsModule,
    SharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MouViewComponentsModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule,
    SharedModule
  ],
  declarations: [
    DocSignerComponent,
    MouCustomerRequestComponent,
    MouCustomerRequestDetailComponent,
    MouCustomerDetailComponent,
    CustomerDocPrintingDetailComponent,
    CustomerDocPrintingPagingComponent,
    DocSignerComponent,
    MouReviewPagingComponent,
    MouReviewFactoringComponent,
    MouDetailGeneralComponent,
    MouDetailFactoringComponent,
    MouCustAssetComponent,
    MouCustAssetDetailComponent,
    MouCustFeeComponent,
    MouCustFeeDetailComponent,
    MouCustTcComponent,
    MouCustListedCustFctrComponent,
    MouCustListedCustFctrDetailComponent,
    MouRequestAddcollComponent,
    DocSignerDetailComponent,
    EditMouCustomerComponent,
    LegalReviewPagingComponent,
    LegalReviewDetailComponent,
    MouCustomerApprovalComponent,
    MouApprovalGeneralComponent,
    MouApprovalFactoringComponent,
    MouReviewGeneralComponent,
    MouDetailFactoringComponent,
    MouCustomerInquiryComponent,
    MouDetailGeneralComponent,
    MouDetailFactoringComponent,
    MouCustAssetComponent,
    MouCustAssetDetailComponent,
    MouCustAssetComponent,
    MouCustAssetDetailComponent,
    MouDetailGeneralComponent,
    TestUploadComponent,
    MouCancelComponent,
    MouOsTcPagingComponent,
    MouOsTcDetailComponent,
    UnauthorizedPageComponent,
    MouExecutionPagingComponent,
    MouExecutionDetailComponent,
    MouCustTabComponent,
    MouCustPersonalContactInfoComponent,
    MouCustPersonalFinancialComponent,
    MouCustBankAccComponent,
    MouCustJobDataComponent,
    MouCustSocmedComponent,
    MouCustGrpMbrComponent,
    MouCustPersonalMainComponent,
    MouCustCompanyContactInfoComponent,
    MouCustCompanyFinancialComponent,
    MouCustCompanyMainComponent,
    MouCustLegalDocComponent,
    MouCustMgmntShrholderComponent,
    SimilarMouPersonalDataComponent,
    SimilarMouCompanyDataComponent,
    MouDupCheckPagingComponent,
    ExistingMouCompanyComponent,
    ExistingMouPersonalComponent
  ],
  exports: [],
  providers: [NGXToastrService],
  entryComponents: [
    MouCustAssetDetailComponent,
    MouCustFeeDetailComponent,
    MouCustAssetDetailComponent,
    MouCustomerApprovalComponent,
    MouApprovalGeneralComponent,
    MouApprovalFactoringComponent,
    MouRequestAddcollComponent,
    MouCustListedCustFctrDetailComponent
  ]
})

export class MouModule { }