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
import { AssetExpenseComponent } from "./asset-expense-opl/asset-expense.component";
import { AssetExpenseAddEditComponent } from "./asset-expense-opl/asset-expense-add-edit/asset-expense-add-edit.component";
import { AssetOplMainInfoComponent } from "./asset-opl-main-info/asset-opl-main-info.component";
import { FinancialDataOplEditComponent } from "./financial-data-opl/detail/financial-data-opl-detail.component";
import { FinancialDataOplComponent } from "./financial-data-opl/financial-data-opl.component";
import { AssetDataOplComponent } from "./multi-asset-data/asset-data-opl/asset-data-opl.component";
import { ApplicationDataDsfComponent } from "app/NEW-NAP/DSF/input-nap-component-dsf/application-data-dsf/application-data-dsf.component";
import { AppCustAssetDetailComponent } from "./app-cust-asset/app-cust-asset-detail/app-cust-asset-detail.component";
import { AppCustAssetComponent } from "./app-cust-asset/app-cust-asset.component";
import { AppCustAssetOldNapDetailComponent } from "./app-cust-asset-old-nap/app-cust-asset-old-nap-detail/app-cust-asset-old-nap-detail.component";
import { AppCustAssetOldNapComponent } from "./app-cust-asset-old-nap/app-cust-asset-old-nap.component";
import { ApplicationDataDlfnComponent } from "./application-data/application-data-dlfn/application-data-dlfn.component";
import { InvoiceDataDlfnComponent } from "./invoice-data/invoice-data-dlfn/invoice-data-dlfn.component";
import { EditInvoiceDataComponent } from "./invoice-data/edit-invoice-data/edit-invoice-data.component";
import { FinancialDataDlfnComponent } from "./financial-data-dlfn/financial-data-dlfn.component";
import { FeeDlfnComponent } from "./financial-data-dlfn/component/fee-dlfn/fee-dlfn.component";
import { SchmDataDlfnComponent } from "./financial-data-dlfn/component/schm-data-dlfn/schm-data-dlfn.component";
import { SingleInstDlfnComponent } from "./financial-data-dlfn/component/single-inst-dlfn/single-inst-dlfn.component";
import { SchmEvenPrincipalDlfnComponent } from "./financial-data-dlfn/component/multi-inst/schm-even-principal-dlfn/schm-even-principal-dlfn.component";
import { SchmRegularFixDlfnComponent } from "./financial-data-dlfn/component/multi-inst/schm-regular-fix-dlfn/schm-regular-fix-dlfn.component";
import { FeeCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/fee/fee-cfna.component";
import { SchmRegulerFixCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-reguler-fix/schm-reguler-fix-cfna.component";
import { SchmIrregularCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-irregular/schm-irregular-cfna.component";
import { SchmStepUpStepDownNormalCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal-cfna.component";
import { SchmStepUpStepDownLeasingCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing-cfna.component";
import { SchmStepUpStepDownCummulativeCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative-cfna.component";
import { SchmBalloonCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-baloon/schm-balloon-cfna.component";
import { SchmEvenPrincipalCFNAComponent } from "app/NEW-NAP/CFNA/nap-components/financial-data/component/schm-even-principal/schm-even-principal-cfna.component";
import { FeeFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/fee/fee-FL4W.component";
import { SchmRegulerFixFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-reguler-fix/schm-reguler-fix-FL4W.component";
import { SchmIrregularFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-irregular/schm-irregular-FL4W.component";
import { SchmStepUpStepDownNormalFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal-FL4W.component";
import { SchmStepUpStepDownLeasingFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing-FL4W.component";
import { SchmStepUpStepDownCummulativeFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative-FL4W.component";
import { SchmEvenPrincipalFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-even-principal/schm-even-principal-FL4W.component";
import { SchmBalloonFL4WComponent } from "app/NEW-NAP/FL4W/input-nap-FL4W/financial-data-FL4W/component/schm-baloon/schm-balloon-FL4W.component";
import { ApplicationDataOplComponent } from "./application-data/application-data-opl/application-data-opl.component";
import { ApplicationDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/application-data/application-data-x.component";
import { ApplicationDataFL4WXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/application-data/application-data-FL4W/application-data-FL4W-x.component";
import { FinancialDataFctrXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-fctr/financial-data-fctr-x.component";
import { FeeFctrXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-fctr/component/fee/fee-fctr-x.component";
import { FeeDlfnXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/fee-dlfn/fee-dlfn-x.component";
import { FinancialDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/financial-data-x.component";
import { FeeXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/fee/fee-x.component";
import { SchmBalloonXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-baloon/schm-balloon-x.component";
import { SchmEvenPrincipalXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-even-principal/schm-even-principal-x.component";
import { SchmIrregularXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-irregular/schm-irregular-x.component";
import { SchmRegulerFixXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-reguler-fix/schm-reguler-fix-x.component";
import { SchmStepUpStepDownCummulativeXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative-x.component";
import { SchmStepUpStepDownLeasingXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing-x.component";
import { SchmStepUpStepDownNormalXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal-x.component";
import { ViewSubsidyXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data/component/view-subsidy/view-subsidy-x.component";
import { MultiAssetDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/multi-asset-data/multi-asset-data-x.component";
import { AssetDataAddEditXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit-x/asset-data-add-edit-x.component";
import { AssetDataPagingXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging-x.component";
import { AssetDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/asset-data/asset-data-x.component";
import { CollateralDataCfnaPagingXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/collateral-data-cfna/collateral-data-cfna-paging/collateral-data-cfna-paging-x.component';
import { CollateralDataCfnaXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/collateral-data-cfna/collateral-data-cfna-x.component';
import { InsuranceMultiAssetDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/insurance-data/insurance-multi-asset-data-x/insurance-multi-asset-data-x.component";

import { ApplicationDataDlfnXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/application-data/application-data-dlfn/application-data-dlfn-x.component';
import { FinancialDataDlfnXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/financial-data-dlfn-x.component';
import { SingleInstDlfnXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/single-inst-dlfn/single-inst-dlfn-x.component';
import { SchmRegularFixDlfnXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/multi-inst/schm-regular-fix-dlfn/schm-regular-fix-dlfn-x.component';
import { SchmEvenPrincipalDlfnXComponent } from 'app/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-dlfn/component/multi-inst/schm-even-principal-dlfn/schm-even-principal-dlfn-x.component';
import { ApplicationDataXDsfComponent } from "app/NEW-NAP/DSF/input-nap-component-dsf/application-data-x-dsf/application-data-x-dsf.component";
import { ApplicationDataXFL4WDsfComponent } from "app/NEW-NAP/DSF/input-nap-component-dsf/application-data-x-FL4W-dsf/application-data-x-FL4W-dsf.component";
import { ApplicationDataDlfnXDsfComponent } from "app/NEW-NAP/DSF/input-nap-component-dsf/application-data-dlfn-x-dsf/application-data-dlfn-x-dsf.component";
import { LoanObjectXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/application-data/loan-object-x/loan-object-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { ReferantorDataNewComponent } from "./referantor-data-new/referantor-data-new.component";
import { ReferantorDataNewDetailComponent } from "./referantor-data-new-detail/referantor-data-new-detail.component";
import { UcInsuranceComponent } from "./insurance-data/uc-insurance/uc-insurance.component";
import { UcInsuranceDetailComponent } from "./insurance-data/uc-insurance/uc-insurance-detail/uc-insurance-detail.component";
import { UcInsurancePagingComponent } from "./insurance-data/uc-insurance/uc-insurance-paging/uc-insurance-paging.component";
import { UcInsuranceXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/insurance-data/uc-insurance-x/uc-insurance-x.component";
import { UcInsuranceDetailXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/insurance-data/uc-insurance-x/uc-insurance-detail-x/uc-insurance-detail-x.component";
import { LoanObjectXDsfComponent } from "app/NEW-NAP/DSF/input-nap-component-dsf/loan-object-x-dsf/loan-object-x-dsf.component";
import { TcDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/tc-data/tc-data-x.component";
import { LifeInsuranceDataXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/life-insurance-data/life-insurance-data-x.component";
import { FinancialDataXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/financial-data-x-dsf.component";
import { SchmBalloonXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-balloon-x-dsf/schm-balloon-x-dsf.component";
import { SchmEvenPrincipalXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-even-principal-x-dsf/schm-even-principal-x-dsf.component";
import { SchmIrregularXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-irregular-x-dsf/schm-irregular-x-dsf.component";
import { SchmRegulerFixXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-reguler-fix-x-dsf/schm-reguler-fix-x-dsf.component";
import { SchmStepUpStepDownCummulativeXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-step-up-step-down-cummulative-x-dsf/schm-step-up-step-down-cummulative-x-dsf.component";
import { SchmStepUpStepDownLeasingXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-step-up-step-down-leasing-x-dsf/schm-step-up-step-down-leasing-x-dsf.component";
import { SchmStepUpStepDownNormalXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/schm-step-up-step-down-normal-x-dsf/schm-step-up-step-down-normal-x-dsf.component";
import { FeeXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/financial-data-x-dsf/component/fee-x-dsf/fee-x-dsf.component";
import { MultiAssetDataXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/multi-asset-data-x-dsf/multi-asset-data-x-dsf.component";
import { AssetDataXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/asset-data-x-dsf/asset-data-x-dsf.component";
import { AssetDataPagingXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/multi-asset-data-x-dsf/asset-data-paging-x-dsf/asset-data-paging-x-dsf.component";
import { AssetDataAddEditXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/multi-asset-data-x-dsf/asset-data-add-edit-x-dsf/asset-data-add-edit-x-dsf.component";
import { UcInsuranceXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/insurance-data-dsf/uc-insurance-x-dsf/uc-insurance-x-dsf.component";
import { InsuranceMultiAssetDataXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/insurance-data-dsf/insurance-multi-asset-data-x-dsf/insurance-multi-asset-data-x-dsf.component";

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
    LifeInsuranceDataXComponent,
    ApplicationDataComponent,
    ApplicationDataOplComponent,
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
    TcDataXComponent, // sementara nanti dicross check sama term-conditions
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
    AssetDataAddEditXComponent,
    AssetDataAddEditXDsfComponent,
    CollateralAddEditComponent,
    MultiAssetDataComponent,
    MultiAssetDataXComponent,
    MultiAssetDataXDsfComponent,
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
    CollateralDataCfnaDetailComponent,
    AssetExpenseComponent,
    AssetExpenseAddEditComponent,
    AssetOplMainInfoComponent,
    FinancialDataOplEditComponent,
    FinancialDataOplComponent,
    AssetDataOplComponent,
    ApplicationDataDsfComponent,
    // MultiAssetLeasingComponent,
    // AssetLeasingPagingComponent,
    // AssetLeasingAddEditComponent,
    // CollateralLeasingAddEditComponent
    AppCustAssetComponent,
    AppCustAssetDetailComponent,
    AppCustAssetOldNapComponent,
    AppCustAssetOldNapDetailComponent,
    ReferantorDataNewComponent,

    ApplicationDataDlfnComponent,
    InvoiceDataDlfnComponent,
    EditInvoiceDataComponent,
    FinancialDataDlfnComponent,
    FeeDlfnComponent,
    SchmDataDlfnComponent,
    SingleInstDlfnComponent,
    SchmEvenPrincipalDlfnComponent,
    SchmRegularFixDlfnComponent,

    FeeCFNAComponent,
    SchmRegulerFixCFNAComponent,
    SchmIrregularCFNAComponent,
    SchmStepUpStepDownNormalCFNAComponent,
    SchmStepUpStepDownLeasingCFNAComponent,
    SchmStepUpStepDownCummulativeCFNAComponent,
    SchmBalloonCFNAComponent,
    SchmEvenPrincipalCFNAComponent,

    FeeFL4WComponent,
    SchmRegulerFixFL4WComponent,
    SchmIrregularFL4WComponent,
    SchmStepUpStepDownNormalFL4WComponent,
    SchmStepUpStepDownLeasingFL4WComponent,
    SchmStepUpStepDownCummulativeFL4WComponent,
    SchmEvenPrincipalFL4WComponent,
    SchmBalloonFL4WComponent,
    ApplicationDataXComponent,
    ApplicationDataFL4WXComponent,
    FinancialDataFctrXComponent,
    FeeFctrXComponent,
    FeeDlfnXComponent,
    FinancialDataXComponent,
    FinancialDataXDsfComponent,
    FeeXComponent,
    FeeXDsfComponent,
    SchmBalloonXComponent,
    SchmBalloonXDsfComponent,
    SchmEvenPrincipalXComponent,
    SchmEvenPrincipalXDsfComponent,
    SchmIrregularXComponent,
    SchmIrregularXDsfComponent,
    SchmRegulerFixXComponent,
    SchmRegulerFixXDsfComponent,
    SchmStepUpStepDownCummulativeXComponent,
    SchmStepUpStepDownCummulativeXDsfComponent,
    SchmStepUpStepDownLeasingXComponent,
    SchmStepUpStepDownLeasingXDsfComponent,
    SchmStepUpStepDownNormalXComponent,
    SchmStepUpStepDownNormalXDsfComponent,
    ViewSubsidyXComponent,
    MultiAssetDataXComponent,
    AssetDataPagingXComponent,
    AssetDataPagingXDsfComponent,
    AssetDataXComponent,
    AssetDataXDsfComponent,
    CollateralDataCfnaXComponent,
    CollateralDataCfnaPagingXComponent,
    InsuranceMultiAssetDataXComponent,
    InsuranceMultiAssetDataXDsfComponent,
    ApplicationDataDlfnXComponent,
    FinancialDataDlfnXComponent,
    SingleInstDlfnXComponent,
    SchmRegularFixDlfnXComponent,
    SchmEvenPrincipalDlfnXComponent,
    ApplicationDataXDsfComponent,
    ApplicationDataXFL4WDsfComponent,
    ApplicationDataDlfnXDsfComponent,
    LoanObjectXComponent,
    LoanObjectXDsfComponent,
  ],
  imports: [
    CommonModule,
    AdInsModule,
    AdInsSharedModule,
    TcSharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CustSharingComponentModule,
    UcaddtotempModule,
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
    LifeInsuranceDataXComponent,
    ApplicationDataComponent,
    ApplicationDataOplComponent,
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
    TcDataXComponent, // sementara nanti dicross check sama term-conditions,
    SchmRegulerFixComponent,
    SchmStepUpStepDownNormalComponent,
    SchmStepUpStepDownLeasingComponent,
    SchmStepUpStepDownCummulativeComponent,
    SchmIrregularComponent,
    SchmBalloonComponent,
    SchmEvenPrincipalComponent,
    AssetDataPagingComponent,
    AssetDataAddEditComponent,
    AssetDataAddEditXComponent,
    AssetDataAddEditXDsfComponent,
    CollateralAddEditComponent,
    MultiAssetDataComponent,
    MultiAssetDataXComponent,
    MultiAssetDataXDsfComponent,
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
    CollateralLeasingAddEditComponent,
    AssetExpenseComponent,
    AssetExpenseAddEditComponent,
    AssetOplMainInfoComponent,
    FinancialDataOplEditComponent,
    FinancialDataOplComponent,
    AssetDataOplComponent,
    ApplicationDataDsfComponent,
    AppCustAssetDetailComponent,
    AppCustAssetComponent,
    AppCustAssetOldNapComponent,
    AppCustAssetOldNapDetailComponent,
    ReferantorDataNewComponent,
    ReferantorDataNewDetailComponent,
    ApplicationDataDlfnComponent,
    InvoiceDataDlfnComponent,
    EditInvoiceDataComponent,
    FinancialDataDlfnComponent,
    FeeDlfnComponent,
    SchmDataDlfnComponent,
    SingleInstDlfnComponent,
    SchmEvenPrincipalDlfnComponent,
    SchmRegularFixDlfnComponent,
    FeeCFNAComponent,
    SchmRegulerFixCFNAComponent,
    SchmIrregularCFNAComponent,
    SchmStepUpStepDownNormalCFNAComponent,
    SchmStepUpStepDownLeasingCFNAComponent,
    SchmStepUpStepDownCummulativeCFNAComponent,
    SchmBalloonCFNAComponent,
    SchmEvenPrincipalCFNAComponent,
    FeeFL4WComponent,
    SchmRegulerFixFL4WComponent,
    SchmIrregularFL4WComponent,
    SchmStepUpStepDownNormalFL4WComponent,
    SchmStepUpStepDownLeasingFL4WComponent,
    SchmStepUpStepDownCummulativeFL4WComponent,
    SchmEvenPrincipalFL4WComponent,
    SchmBalloonFL4WComponent,
    ApplicationDataXComponent,
    ApplicationDataFL4WXComponent,
    FinancialDataFctrXComponent,
    FeeFctrXComponent,
    FeeDlfnXComponent,
    FinancialDataXComponent,
    FinancialDataXDsfComponent,
    FeeXComponent,
    FeeXDsfComponent,
    SchmBalloonXComponent,
    SchmBalloonXDsfComponent,
    SchmEvenPrincipalXComponent,
    SchmEvenPrincipalXDsfComponent,
    SchmIrregularXComponent,
    SchmIrregularXDsfComponent,
    SchmRegulerFixXComponent,
    SchmRegulerFixXDsfComponent,
    SchmStepUpStepDownCummulativeXComponent,
    SchmStepUpStepDownCummulativeXDsfComponent,
    SchmStepUpStepDownLeasingXComponent,
    SchmStepUpStepDownLeasingXDsfComponent,
    SchmStepUpStepDownNormalXComponent,
    SchmStepUpStepDownNormalXDsfComponent,
    ViewSubsidyXComponent,
    MultiAssetDataXComponent,
    AssetDataPagingXComponent,
    AssetDataPagingXDsfComponent,
    AssetDataXComponent,
    AssetDataXDsfComponent,
    CollateralDataCfnaXComponent,
    CollateralDataCfnaPagingXComponent,
    InsuranceMultiAssetDataXComponent,
    ApplicationDataDlfnXComponent,
    FinancialDataDlfnXComponent,
    SingleInstDlfnXComponent,
    SchmRegularFixDlfnXComponent,
    SchmEvenPrincipalDlfnXComponent,
    ApplicationDataXDsfComponent,
    ApplicationDataXFL4WDsfComponent,
    ApplicationDataDlfnXDsfComponent,
    LoanObjectXComponent,
    LoanObjectXDsfComponent,
    UcInsuranceComponent,
    UcInsuranceDetailComponent,
    UcInsurancePagingComponent,
    UcInsuranceXComponent,
    UcInsuranceXDsfComponent,
    UcInsuranceDetailXComponent
  ],
  entryComponents: [SubsidyAddEditComponent, UclookupgenericComponent, LookupTaxCityIssuerComponent, LookupCollateralComponent, AppCustAssetDetailComponent, AppCustAssetOldNapDetailComponent, ReferantorDataNewDetailComponent],
  providers: [
    NGXToastrService
  ]
})
export class InputNapComponentModule { }
