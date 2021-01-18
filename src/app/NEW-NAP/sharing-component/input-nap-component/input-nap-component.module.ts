import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TcSharingComponentModule } from "./tc-sharing-component.module";
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
import { ApplicationDataRefinancingComponent } from "./application-data/application-data-refinancing/application-data-refinancing.component";
import { LoanObjectComponent } from "./application-data/loan-object/loan-object.component";
import { SchmStepUpStepDownNormalComponent } from "./financial-data/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal.component";
import { SchmRegulerFixComponent } from "./financial-data/component/schm-reguler-fix/schm-reguler-fix.component";
import { SchmStepUpStepDownLeasingComponent } from "./financial-data/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing.component";
import { SchmStepUpStepDownCummulativeComponent } from "./financial-data/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative.component";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { SchmIrregularComponent } from "./financial-data/component/schm-irregular/schm-irregular.component";
import { SchmBalloonComponent } from "./financial-data/component/schm-baloon/schm-balloon.component";

import { SchmEvenPrincipalComponent } from "./financial-data/component/schm-even-principal/schm-even-principal.component";
import { AssetDataPagingComponent } from "./multi-asset-data/asset-data-paging/asset-data-paging.component";
import { AssetDataAddEditComponent } from "./multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { MultiAssetDataComponent } from "./multi-asset-data/multi-asset-data.component";
import { MultiAssetLeasingComponent } from "./multi-asset-leasing/multi-asset-leasing.component";
import { AssetLeasingPagingComponent } from "./multi-asset-leasing/asset-leasing-paging/asset-leasing-paging.component";
import { AssetLeasingAddEditComponent } from "./multi-asset-leasing/asset-leasing-add-edit/asset-leasing-add-edit.component";
import { CollateralLeasingAddEditComponent } from "./multi-asset-leasing/collateral-leasing-add-edit/collateral-leasing-add-edit.component";
import { FinancialDataFctrComponent } from "./financial-data-fctr/financial-data-fctr.component";
import { SchmRegulerFixFctrComponent } from "./financial-data-fctr/component/multiple-installment/schm-reguler-fix/schm-reguler-fix-fctr.component";
import { CustSharingComponentModule } from "./cust-sharing-component.module";
import { SchmEvenPrincipalFctrComponent } from "./financial-data-fctr/component/multiple-installment/schm-even-principal/schm-even-principal-fctr.component";
import { SingleInstFctrComponent } from "./financial-data-fctr/component/single-installment/single-inst-fctr.component";
import { FeeFctrComponent } from "./financial-data-fctr/component/fee/fee-fctr.component";
import { CollateralAddEditSingleComponent } from "./single-asset-data/collateral-add-edit-single/collateral-add-edit-single.component";
import { InvoiceDataComponent } from "./invoice-data/invoice-data.component";
import { ApplicationDataFactoringComponent } from './application-data/application-data-factoring/application-data-factoring.component';
import { MultiCollateralPagingComponent } from "./collateral-data/component/multi-collateral-paging/multi-collateral-paging.component";
import { CollateralDetailComponent } from "./collateral-data/component/collateral-detail/collateral-detail.component";
import { SingleCollDataComponent } from "./collateral-data/single-coll-data/single-coll-data.component";
import { MultiCollDataComponent } from "./collateral-data/multi-coll-data/multi-coll-data.component";
import { ApplicationDataFL4WComponent } from "./application-data/application-data-FL4W/application-data-FL4W.component";
import { UclookupgenericComponent } from "@adins/uclookupgeneric";
import { GuarantorLegalDocComponent } from "./guarantor-data/guarantor-company/guarantor-legal-doc/guarantor-legal-doc.component";
import { LookupTaxCityIssuerComponent } from './multi-asset-data/collateral-add-edit/lookup-tax-city-issuer/lookup-tax-city-issuer.component';
import { LookupCollateralComponent } from './multi-asset-data/collateral-add-edit/lookup-collateral/lookup-collateral.component';
import { UcaddtotempModule } from '@adins/ucaddtotemp';
import { CollateralDataCfnaComponent } from './collateral-data-cfna/collateral-data-cfna.component';
import { CollateralDataCfnaPagingComponent } from './collateral-data-cfna/collateral-data-cfna-paging/collateral-data-cfna-paging.component';
import { CollateralDataCfnaDetailComponent } from './collateral-data-cfna/collateral-data-cfna-detail/collateral-data-cfna-detail.component';
import { GuarantorComponent } from "./guarantor-data/guarantor.component";
import { GuarantorCompanyComponent } from "./guarantor-data/guarantor-company/guarantor-company.component";
import { GuarantorPersonalComponent } from "./guarantor-data/guarantor-personal/guarantor-personal.component";
import { GuarantorPagingComponent } from "./guarantor-data/guarantor-paging/guarantor-paging.component";
import { SharedModule } from "app/shared/shared.module";

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
  inputMode: CurrencyMaskInputMode.NATURAL };

@NgModule({
  exports: [
    CustomerDataComponent,
    CustUcaddressComponent,
    CustPersonalMainDataComponent,
    CustPersonalContactInformationComponent,
    CustPersonalFinancialDataComponent,
    CustBankAccountComponent,
    CustGrpMemberComponent,
    CustCompanyMainDataComponent,
    CustShareholderComponent,
    CustCompanyContactInformationComponent,
    CustCompanyFinancialDataComponent,
    CustLegalDocComponent,
    TcSharingComponentModule,
    GuarantorComponent,
    GuarantorLegalDocComponent,
    GuarantorPagingComponent,
    GuarantorPersonalComponent,
    GuarantorCompanyComponent,
    LifeInsuranceDataComponent,
    ApplicationDataComponent,
    ApplicationDataRefinancingComponent,
    LoanObjectComponent,
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
    SchmEvenPrincipalComponent,
    AssetDataPagingComponent,
    AssetDataAddEditComponent,
    CollateralAddEditComponent,
    MultiAssetDataComponent,
    FinancialDataFctrComponent,
    SchmRegulerFixFctrComponent,
    SchmEvenPrincipalFctrComponent,
    SingleInstFctrComponent,
    SchmRegulerFixFctrComponent,
    FeeFctrComponent,
    CollateralAddEditSingleComponent,
    InvoiceDataComponent,
    ApplicationDataFactoringComponent,
    MultiCollateralPagingComponent,
    CollateralDetailComponent,
    SingleCollDataComponent,
    MultiCollDataComponent,
    ApplicationDataFL4WComponent,
    CollateralDataCfnaComponent,
    CollateralDataCfnaPagingComponent,
    CollateralDataCfnaDetailComponent
    // MultiAssetLeasingComponent,
    // AssetLeasingPagingComponent,
    // AssetLeasingAddEditComponent,
    // CollateralLeasingAddEditComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
    TcSharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CustSharingComponentModule,
    UcaddtotempModule
  ],
  declarations: [
    CustomerDataComponent,
    CustUcaddressComponent,
    CustPersonalMainDataComponent,
    CustPersonalContactInformationComponent,
    CustPersonalFinancialDataComponent,
    CustBankAccountComponent,
    CustGrpMemberComponent,
    CustCompanyMainDataComponent,
    CustShareholderComponent,
    CustCompanyContactInformationComponent,
    CustCompanyFinancialDataComponent,
    CustLegalDocComponent,
    GuarantorComponent,
    GuarantorLegalDocComponent,
    GuarantorPagingComponent,
    GuarantorPersonalComponent,
    GuarantorCompanyComponent,
    LifeInsuranceDataComponent,
    ApplicationDataComponent,
    ApplicationDataRefinancingComponent,
    LoanObjectComponent,
    SearchCrossAppComponent,
    ReferantorDataComponent,
    AssetDataComponent,
    InsuranceDataComponent,
    InsuranceMultiAssetDataComponent,
    FinancialDataComponent,
    SubsidyComponent,
    SubsidyAddEditComponent,
    FeeComponent,
    TcDataComponent, // sementara nanti dicross check sama term-conditions,
    SchmRegulerFixComponent,
    SchmStepUpStepDownNormalComponent,
    SchmStepUpStepDownLeasingComponent,
    SchmStepUpStepDownCummulativeComponent,
    SchmIrregularComponent,
    SchmBalloonComponent,
    SchmEvenPrincipalComponent,
    AssetDataPagingComponent,
    AssetDataAddEditComponent,
    CollateralAddEditComponent,
    MultiAssetDataComponent,
    FinancialDataFctrComponent,
    SchmRegulerFixFctrComponent,
    SchmEvenPrincipalFctrComponent,
    SingleInstFctrComponent,
    SchmRegulerFixFctrComponent,
    FeeFctrComponent,
    CollateralAddEditSingleComponent,
    InvoiceDataComponent,
    ApplicationDataFactoringComponent,
    MultiCollateralPagingComponent,
    CollateralDetailComponent,
    SingleCollDataComponent,
    MultiCollDataComponent,
    ApplicationDataFL4WComponent,
    LookupTaxCityIssuerComponent,
    LookupCollateralComponent,
    CollateralDataCfnaComponent,
    CollateralDataCfnaPagingComponent,
    CollateralDataCfnaDetailComponent,
    MultiAssetLeasingComponent,
    AssetLeasingPagingComponent,
    AssetLeasingAddEditComponent,
    CollateralLeasingAddEditComponent
  ],
  entryComponents: [SubsidyAddEditComponent, UclookupgenericComponent, LookupTaxCityIssuerComponent, LookupCollateralComponent],
  providers: [
    NGXToastrService
  ]
})
export class InputNapComponentModule { }