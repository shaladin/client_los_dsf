import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';
import { TabReferantorComponent } from './tab-referantor/tab-referantor.component';
import { TabCommissionComponent } from './tab-commission/tab-commission.component';
import { ListDataCommissionComponent } from './tab-commission/list-data-commission/list-data-commission.component';
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { LifeInsuranceComponent } from './life-insurance/life-insurance.component';
import { AppTcComponent } from './app-tc/app-tc.component';
import { ViewInsuranceComponent } from "./view-insurance/view-insurance.component";
import { GuarantorComponent } from './view-guarantor/view-guarantor.component';
import { ViewPhoneVerifComponent } from "./view-phone-verif/view-phone-verif.component";
import { ViewAssetDataComponent } from "./view-asset-data/view-asset-data.component";
import { TabApplicationComponent } from './tab-application/tab-application.component';
import { TabAnalysisResultComponent } from './tab-analysis-result/tab-analysis-result.component';
import { AppAssetDataComponent } from './app-asset-data/app-asset-data.component';
import { AppAssetDataDetailComponent } from './app-asset-data/app-asset-data-detail/app-asset-data-detail.component';
import { ViewFinancialComponent } from "./view-financial/view-financial.component";
import { AppInsuranceComponent } from './app-insurance/app-insurance.component';
import { AppInsuranceDetailComponent } from './app-insurance/app-insurance-detail/app-insurance-detail.component';
import { ViewSharingComponentModule } from "./view-sharing-component.module";
import { ViewAppFraudVerificationComponent } from './view-app-fraud-verification/view-app-fraud-verification.component';
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ApprovalHistComponent } from './approval-hist/approval-hist.component';
import { UcapprovalhistModule  } from '@adins/ucapprovalhist';
import { TabDeviationComponent } from "./tab-deviation/tab-deviation.component";
import { InvoiceViewComponent } from "app/NEW-NAP/business-process/admin-process/invoice/invoice-view/invoice-view.component";
import { ViewCollateralDataComponent } from "./view-collateral-data/view-collateral-data.component";
import { ViewCollateralMultiAssetComponent } from "./view-collateral-multi-asset/view-collateral-multi-asset.component";
import { ApprovalhistDevComponent } from 'app/NEW-NAP/sharing-component/approvalhist-dev/approvalhist-dev.component';

@NgModule({
  exports: [
    ViewReservedFundComponent,
    ViewInsuranceComponent,
    ViewFinancialComponent,
    TabReferantorComponent,
    TabCommissionComponent,
    ListDataCommissionComponent,
    TabAnalysisResultComponent,
    ViewAssetDataComponent,
    ViewPhoneVerifComponent,
    GuarantorComponent,
    TabApplicationComponent,
    LifeInsuranceComponent,
    AppTcComponent,
    TabDeviationComponent,
    InvoiceDataFctrComponent,
    InvoiceViewComponent,
    ViewCollateralDataComponent,
    ViewCollateralMultiAssetComponent,
    AppAssetDataComponent,
    AppInsuranceComponent,
    AppInsuranceDetailComponent,
    AppAssetDataDetailComponent,
    ApprovalHistComponent,
    ApprovalhistDevComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
    ViewSharingComponentModule,
    UcviewgenericModule,
    UcSubsectionModule,
    UcapprovalhistModule
  ],
  declarations: [
    InvoiceDataFctrComponent,
    TabReferantorComponent,
    TabCommissionComponent,
    ListDataCommissionComponent,
    ViewReservedFundComponent,
    LifeInsuranceComponent,
    AppTcComponent,
    ViewInsuranceComponent,
    GuarantorComponent,
    ViewPhoneVerifComponent,
    ViewAssetDataComponent,
    TabApplicationComponent,
    TabAnalysisResultComponent,
    AppAssetDataComponent,
    AppAssetDataDetailComponent,
    ApprovalHistComponent,
    ViewFinancialComponent,
    AppInsuranceComponent,
    AppInsuranceDetailComponent,
    //ViewAppFraudVerificationComponent,
    TabDeviationComponent,
    InvoiceViewComponent,
    ViewCollateralDataComponent,
    ViewCollateralMultiAssetComponent,
    ApprovalhistDevComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    AppAssetDataDetailComponent,
    AppInsuranceDetailComponent
  ]
})
export class ViewAppComponentModule { }
