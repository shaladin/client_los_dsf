import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TcSharingComponentModule } from "./tc-sharing-component.module";
import { GuarantorComponent } from "./guarantor-data/guarantor.component";
import { LifeInsuranceDataComponent } from "./life-insurance-data/life-insurance-data.component";
import { ApplicationDataComponent } from "./application-data/application-data.component";
import { SearchCrossAppComponent } from "./application-data/search-cross-app/search-cross-app.component";
import { ReferantorDataComponent } from "./referantor-data/referantor-data.component";
import { AssetDataComponent } from "./asset-data/asset-data.component";
import { CustomerDataComponent } from "./customer-data/customer-data.component";
import { CustUcaddressComponent } from "./customer-data/component/address/ucaddress.component";
import { CustPersonalMainDataComponent } from "./customer-data/component/personal-main-data/cust-personal-main-data.component";
import { CustPersonalContactInformationComponent } from "./customer-data/component/personal-contact-information/cust-personal-contact-information.component";
import { CustPersonalFinancialDataComponent } from "./customer-data/component/personal-financial-data/cust-personal-financial-data.component";
import { CustBankAccountComponent } from "./customer-data/component/bank-account/cust-bank-account.component";
import { CustJobDataComponent } from "./customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "./customer-data/component/socmed/cust-socmed.component";
import { CustGrpMemberComponent } from "./customer-data/component/cust-grp-member/cust-grp-member.component";
import { CustCompanyMainDataComponent } from "./customer-data/component/company-main-data/cust-company-main-data.component";
import { CustShareholderComponent } from "./customer-data/component/shareholder/cust-shareholder.component";
import { CustCompanyContactInformationComponent } from "./customer-data/component/company-contact-information/cust-company-contact-information.component";
import { CustCompanyFinancialDataComponent } from "./customer-data/component/company-financial-data/cust-company-financial-data.component";
import { CustLegalDocComponent } from "./customer-data/component/legal-doc/cust-legal-doc.component";
import { InsuranceDataComponent } from "./insurance-data/insurance-data.component";
import { InsuranceMultiAssetDataComponent } from "./insurance-data/insurance-multi-asset-data/insurance-multi-asset-data.component";
import { FinancialDataComponent } from "./financial-data/financial-data.component";
import { SubsidyComponent } from "./financial-data/component/subsidy/subsidy.component";
import { SubsidyAddEditComponent } from "./financial-data/component/subsidy-add-edit/subsidy-add-edit.component";
import { FeeComponent } from "./financial-data/component/fee/fee.component";
import { TcDataComponent } from "./tc-data/tc-data.component";
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { GuarantorPersonalComponent } from "./guarantor-data/guarantor-personal/guarantor-personal.component";
import { GuarantorCompanyComponent } from "./guarantor-data/guarantor-company/guarantor-company.component";
import { GuarantorPagingComponent } from "./guarantor-data/guarantor-paging/guarantor-paging.component";
import { SchmStepUpStepDownNormalComponent } from "./financial-data/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal.component";
import { SchmRegulerFixComponent } from "./financial-data/component/schm-reguler-fix/schm-reguler-fix.component";
import { SchmStepUpStepDownLeasingComponent } from "./financial-data/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing.component";
import { SchmStepUpStepDownCummulativeComponent } from "./financial-data/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative.component";
import { NgxCurrencyModule } from "ngx-currency";
import { SchmIrregularComponent } from "./financial-data/component/schm-irregular/schm-irregular.component";
import { SchmBalloonComponent } from "./financial-data/component/schm-baloon/schm-balloon.component";

import { SchmEvenPrincipalComponent } from "./financial-data/component/schm-even-principal/schm-even-principal.component";
export const customCurrencyMaskConfig = {     
  align: "right",     
  allowNegative: true,     
  allowZero: true,     
  decimal: ".",     
  precision: 2,     
  prefix: "",     
  suffix: "",     
  thousands: ",",     
  nullable: false };

@NgModule({
  exports: [
    CustomerDataComponent,
    CustUcaddressComponent,
    CustPersonalMainDataComponent,
    CustPersonalContactInformationComponent,
    CustPersonalFinancialDataComponent,
    CustBankAccountComponent,
    CustJobDataComponent,
    CustSocmedComponent,
    CustGrpMemberComponent,
    CustCompanyMainDataComponent,
    CustShareholderComponent,
    CustCompanyContactInformationComponent,
    CustCompanyFinancialDataComponent,
    CustLegalDocComponent,
    TcSharingComponentModule,
    GuarantorComponent,
    GuarantorPagingComponent,
    GuarantorPersonalComponent,
    GuarantorCompanyComponent,
    LifeInsuranceDataComponent,
    ApplicationDataComponent,
    SearchCrossAppComponent,
    ReferantorDataComponent,
    AssetDataComponent,
    InsuranceDataComponent,
    InsuranceMultiAssetDataComponent,
    FinancialDataComponent,
    SubsidyComponent,
    SubsidyAddEditComponent,
    FeeComponent,
    TcDataComponent, // sementara nanti dicross check sama term-conditions
    SchmRegulerFixComponent,
    SchmStepUpStepDownNormalComponent,
    SchmStepUpStepDownLeasingComponent,
    SchmIrregularComponent,
    SchmBalloonComponent,
    SchmStepUpStepDownCummulativeComponent,
    SchmIrregularComponent,
    SchmEvenPrincipalComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
    TcSharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    CustomerDataComponent,
    CustUcaddressComponent,
    CustPersonalMainDataComponent,
    CustPersonalContactInformationComponent,
    CustPersonalFinancialDataComponent,
    CustBankAccountComponent,
    CustJobDataComponent,
    CustSocmedComponent,
    CustGrpMemberComponent,
    CustCompanyMainDataComponent,
    CustShareholderComponent,
    CustCompanyContactInformationComponent,
    CustCompanyFinancialDataComponent,
    CustLegalDocComponent,
    GuarantorComponent,
    GuarantorPagingComponent,
    GuarantorPersonalComponent,
    GuarantorCompanyComponent,
    LifeInsuranceDataComponent,
    ApplicationDataComponent,
    SearchCrossAppComponent,
    ReferantorDataComponent,
    AssetDataComponent,
    InsuranceDataComponent,
    InsuranceMultiAssetDataComponent,
    FinancialDataComponent,
    SubsidyComponent,
    SubsidyAddEditComponent,
    FeeComponent,
    TcDataComponent, // sementara nanti dicross check sama term-conditions
    SchmRegulerFixComponent, 
    SchmStepUpStepDownNormalComponent,
    SchmStepUpStepDownLeasingComponent,
    SchmStepUpStepDownCummulativeComponent,
    SchmIrregularComponent ,
    SchmBalloonComponent,
    SchmEvenPrincipalComponent
  ],
  entryComponents: [SubsidyAddEditComponent],
  providers: [
    NGXToastrService
  ]
})
export class InputNapComponentModule { }