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
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ApprovalHistComponent } from './approval-hist/approval-hist.component';
import { UcapprovalhistModule  } from '@adins/ucapprovalhist';
import { TabDeviationComponent } from "./tab-deviation/tab-deviation.component";
import { InvoiceViewComponent } from "app/NEW-NAP/business-process/admin-process/invoice/invoice-view/invoice-view.component";
import { ViewCollateralDataComponent } from "./view-collateral-data/view-collateral-data.component";
import { ViewCollateralMultiAssetComponent } from "./view-collateral-multi-asset/view-collateral-multi-asset.component";
import { ApprovalhistDevComponent } from 'app/NEW-NAP/sharing-component/approvalhist-dev/approvalhist-dev.component';
import { TabAppDataComponent } from './tab-application-data/tab-app-data.component';
import { NewApplicationDataComponent } from "./application-data/new-application-data.component";
import { ViewSurveyTaskListComponent } from "./view-survey-task-list/view-survey-task-list.component";
import { ViewSummaryAppComponent } from "./view-summary-app/view-summary-app.component";
import { ViewAppScoreGradeScoringComponent } from "./view-app-score-grade-scoring/view-app-score-grade-scoring.component";
import { ViewAppScoreGradeDsrComponent } from "./view-app-score-grade-dsr/view-app-score-grade-dsr.component";
import { ViewAppScoreGradeDukcapilComponent } from "./view-app-score-grade-dukcapil/view-app-score-grade-dukcapil.component";
import { ViewSummaryAppCfnaComponent } from './view-summary-app-cfna/view-summary-app-cfna.component';
import { ViewSummaryAppROSComponent } from "./view-summary-app-ros/view-summary-app-ros.component";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "app/app.module";
import { HttpClient } from "@angular/common/http";
import { ViewSumamryAppCfnaDsfComponent } from "app/NEW-NAP/DSF/credit-review-component-dsf/view-app-component-dsf/view-sumamry-app-cfna-dsf/view-sumamry-app-cfna-dsf.component";
import { ViewAppScoreGradeDatarobotDsfComponent } from "app/NEW-NAP/DSF/credit-review-component-dsf/view-app-component-dsf/view-app-score-grade-datarobot-dsf/view-app-score-grade-datarobot-dsf.component";

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
    ApprovalhistDevComponent,
    TabAppDataComponent,
    ViewSurveyTaskListComponent,
    ViewSummaryAppComponent,
    ViewAppScoreGradeScoringComponent,
    ViewAppScoreGradeDsrComponent,
    ViewAppScoreGradeDukcapilComponent,
    NewApplicationDataComponent,
    ViewSummaryAppCfnaComponent,
    ViewSummaryAppROSComponent,
    ViewSumamryAppCfnaDsfComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
    ViewSharingComponentModule,
    UcviewgenericModule,
    UcSubsectionModule,
    UcapprovalhistModule,
    UcapprovalHistoryModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  }),
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
    TabDeviationComponent,
    InvoiceViewComponent,
    ViewCollateralDataComponent,
    ViewCollateralMultiAssetComponent,
    ApprovalhistDevComponent,
    TabAppDataComponent,
    NewApplicationDataComponent,
    ViewSurveyTaskListComponent,
    ViewSummaryAppComponent,
    ViewAppScoreGradeScoringComponent,
    ViewAppScoreGradeDsrComponent,
    ViewAppScoreGradeDukcapilComponent,
    ViewSummaryAppCfnaComponent,
    ViewSummaryAppROSComponent,
    ViewSumamryAppCfnaDsfComponent,
    ViewAppScoreGradeDatarobotDsfComponent
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
