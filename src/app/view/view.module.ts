import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { ViewRoutingModule } from "./view-routing.module";
import { MainInfoComponent } from './main-info/main-info.component';
import { LeadMainInfoComponent } from './lead-main-info/lead-main-info.component';
import { UclookupgenericComponent, UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { AppMainInfoComponent } from "./app-main-info/app-main-info.component";
import { AppViewComponent } from './app-view/app-view.component';
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { UcapprovalhistModule, UcapprovalhistComponent } from "@adins/ucapprovalhist";
import { AppAssetDataComponent } from "./app-view/app-asset-data/app-asset-data.component";
import { AppAssetDataDetailComponent } from "./app-view/app-asset-data/app-asset-data-detail/app-asset-data-detail.component";
import { AppInsuranceComponent } from "./app-view/app-insurance/app-insurance.component";
import { AppInsuranceDetailComponent } from "./app-view/app-insurance/app-insurance-detail/app-insurance-detail.component";
import { AppTcComponent } from "./app-view/app-tc/app-tc.component";

import { ApprovalHistComponent } from "./app-view/approval-hist/approval-hist.component";
import { FraudDetectionResultComponent } from "./app-view/fraud-detection-result/fraud-detection-result.component";
import { FraudVerificationComponent } from "./app-view/fraud-verification/fraud-verification.component";
import { InvoiceDataFctrComponent } from "./app-view/invoice-data-fctr/invoice-data-fctr.component";
import { LifeInsuranceComponent } from "./app-view/life-insurance/life-insurance.component";
import { TabAnalysisResultComponent } from "./app-view/tab-analysis-result/tab-analysis-result.component";
import { TabApplicationComponent } from "./app-view/tab-application/tab-application.component";
import { TabAppDataComponent } from "./app-view/tab-application-data/tab-app-data.component";
import { TabCommissionComponent } from "./app-view/tab-commission/tab-commission.component";
import { TabDeviationComponent } from "./app-view/tab-deviation/tab-deviation.component";
import { TabReferantorComponent } from "./app-view/tab-referantor/tab-referantor.component";
// import { ViewAppCustDataCompanyComponent } from "./app-view/view-app-cust-data-company/view-app-cust-data-company.component";
import { ViewAppScoreGradeDsrComponent } from "./app-view/view-app-score-grade-dsr/view-app-score-grade-dsr.component";
import { ViewAppScoreGradeDukcapilComponent } from "./app-view/view-app-score-grade-dukcapil/view-app-score-grade-dukcapil.component";
import { ViewAppScoreGradeScoringComponent } from "./app-view/view-app-score-grade-scoring/view-app-score-grade-scoring.component";
import { ViewAssetDataComponent } from "./app-view/view-asset-data/view-asset-data.component";
import { ViewCollateralDataComponent } from "./app-view/view-collateral-data/view-collateral-data.component";
import { ViewCollateralMultiAssetComponent } from "./app-view/view-collateral-multi-asset/view-collateral-multi-asset.component";
import { ViewFinancialComponent } from "./app-view/view-financial/view-financial.component";
import { ViewFraudDetectionResultComponent } from "./app-view/view-fraud-detection-result/view-fraud-detection-result.component";
import { GuarantorComponent } from "./app-view/view-guarantor/view-guarantor.component";
import { ViewInsuranceComponent } from "./app-view/view-insurance/view-insurance.component";
import { ViewPhoneVerifComponent } from "./app-view/view-phone-verif/view-phone-verif.component";
import { ViewReservedFundComponent } from "./app-view/view-reserved-fund/view-reserved-fund.component";
import { ViewSummaryAppComponent } from "./app-view/view-summary-app/view-summary-app.component";
import { ViewSummaryAppCfnaComponent } from "./app-view/view-summary-app-cfna/view-summary-app-cfna.component";
import { ViewSurveyTaskListComponent } from "./app-view/view-survey-task-list/view-survey-task-list.component";
import { InvoiceViewComponent } from "./app-view/invoice/invoice-view/invoice-view.component";
import { InvoiceDetailComponent } from "./app-view/invoice/invoice-detail/invoice-detail.component";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { NewApplicationDataComponent } from "./app-view/application-data/new-application-data.component";
import { ListDataCommissionComponent } from "./app-view/tab-commission/list-data-commission/list-data-commission.component";
// import { AgrMainInfoComponent } from "./agr-main-info/agr-main-info.component";
// import { AgreementViewContainerComponent } from "./agr-view/agreement-view-container.component";
import { ViewAgrmntReservedFundComponent } from "./agr-view/view-reserved-fund/view-reserved-fund.component";
import { AgrmntLifeInsuranceComponent } from "./agr-view/life-insurance/life-insurance.component";
import { ViewPurchaseOrderComponent } from "./agr-view/view-purchase-order/view-purchase-order.component";
import { ViewAgrmntDocumentComponent } from "./agr-view/view-document/view-document.component";
import { ViewDeliveryOrderComponent } from "./agr-view/view-delivery-order/view-delivery-order.component";
import { AgrmntFinancialComponent } from "./agr-view/agrmnt-financial/agrmnt-financial.component";
import { ViewAgrmntSummaryComponent } from "./agr-view/view-summary/view-summary.component";
import { ViewCommissionComponent } from "./agr-view/view-commission/view-commission.component";
import { ViewDeviationComponent } from "./agr-view/view-deviation/view-deviation.component";
import { ViewCollateralComponent } from "./agr-view/view-collateral/view-collateral.component";
import { ViewAgrmntInsuranceComponent } from "./agr-view/view-insurance/view-insurance.component";
import { ViewInsuranceDetailComponent } from "./agr-view/view-insurance-detail/view-insurance-detail.component";
import { ViewAppCollateralSingleComponent } from "./agr-view/view-app-collateral-single/view-app-collateral-single.component";
import { ViewAppCollateralMultiComponent } from "./agr-view/view-app-collateral-multi/view-app-collateral-multi.component";
import { PurchaseOrderViewComponent } from "./purchase-order-view/purchase-order-view.component";
import { ViewCustomerDataComponent } from "./lead-view/view-customer-data/view-customer-data.component";
import { ViewLeadDataComponent } from "./lead-view/view-lead-data/view-lead-data.component";
import { LeadViewComponent } from "./lead-view/lead-view.component";
import { MouViewAddcollComponent } from "./mou-view/mou-view-addcoll/mou-view-addcoll.component";
import { MouViewDetailComponent } from "./mou-view/mou-view-detail/mou-view-detail.component";
import { MouViewDocComponent } from "./mou-view/mou-view-doc/mou-view-doc.component";
import { MouViewFeeComponent } from "./mou-view/mou-view-fee/mou-view-fee.component";
import { MouViewLegalComponent } from "./mou-view/mou-view-legal/mou-view-legal.component";
import { MouViewListedCustFactoringComponent } from "./mou-view/mou-view-listed-cust-factoring/mou-view-listed-cust-factoring.component";
import { MouViewSurveyComponent } from "./mou-view/mou-view-survey/mou-view-survey.component";
import { MouViewTcComponent } from "./mou-view/mou-view-tc/mou-view-tc.component";
import { MouViewComponent } from "./mou-view/mou-view.component";
import { MouViewApprovalHistoryComponent } from "./mou-view/mou-view-approval-history/mou-view-approval-history.component";
import { SurveyViewComponent } from "./survey-view-prototype/survey-view.component";
import { AgreementViewContainerComponent } from "./agr-view/agreement-view-container.component";
import { AgrMainInfoComponent } from "./agr-main-info/agr-main-info.component";
import { ListDataCommissionAgrmntComponent } from "./agr-view/view-commission/list-data-commission/list-data-commission.component";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
// import { ShowErrorsComponent } ../NEW-NAP/view/app-view/app-view.componentors.component";

@NgModule({
  imports: [
    ViewRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    UclookupgenericModule,
    UcviewgenericModule,
    UcgridviewModule,
    NgbModule,
    SharingModule,
    ArchwizardModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule,
    UcapprovalhistModule,
    UcShowErrorsModule,
    AppCustViewComponentsModule
  ],
  declarations: [
    MainInfoComponent,
    LeadMainInfoComponent,
    AppMainInfoComponent,
    AgrMainInfoComponent,
    AppViewComponent,
    AppAssetDataComponent,
    AppAssetDataDetailComponent,
    AppInsuranceComponent,
    AppInsuranceDetailComponent,
    AppTcComponent,
    NewApplicationDataComponent,
    ApprovalHistComponent,
    FraudDetectionResultComponent,
    FraudVerificationComponent,
    InvoiceDataFctrComponent,
    LifeInsuranceComponent,
    TabAnalysisResultComponent,
    TabApplicationComponent,
    TabAppDataComponent,
    TabCommissionComponent,
    TabDeviationComponent,
    TabReferantorComponent,
    ViewAppScoreGradeDsrComponent,
    ViewAppScoreGradeDukcapilComponent,
    ViewAppScoreGradeScoringComponent,
    ViewAssetDataComponent,
    ViewCollateralDataComponent,
    ViewCollateralMultiAssetComponent,
    ViewFinancialComponent,
    ViewFraudDetectionResultComponent,
    GuarantorComponent,
    ViewInsuranceComponent,
    ViewPhoneVerifComponent,
    ViewReservedFundComponent,
    ViewSummaryAppComponent,
    ViewSummaryAppCfnaComponent,
    ViewSurveyTaskListComponent,
    InvoiceViewComponent,
    InvoiceDetailComponent ,
    ListDataCommissionComponent,
    //agrmnt
    AgrMainInfoComponent,
    AgreementViewContainerComponent,
    ViewAgrmntReservedFundComponent,
    AgrmntLifeInsuranceComponent,
    ViewPurchaseOrderComponent,
    ViewAgrmntDocumentComponent,
    ViewDeliveryOrderComponent, 
    AgrmntFinancialComponent,
    ViewAgrmntSummaryComponent,
    ViewCommissionComponent,
    ListDataCommissionAgrmntComponent,
    ViewDeviationComponent,
    ViewCollateralComponent,
    ViewAgrmntInsuranceComponent,
    ViewInsuranceDetailComponent,
    ViewAppCollateralSingleComponent,
    ViewAppCollateralMultiComponent,
    PurchaseOrderViewComponent,
    //lead
    ViewCustomerDataComponent,
    ViewLeadDataComponent,
    LeadViewComponent,
    //mou
    MouViewAddcollComponent,
    MouViewDetailComponent,
    MouViewDocComponent,
    MouViewFeeComponent,
    MouViewLegalComponent,
    MouViewListedCustFactoringComponent,
    MouViewSurveyComponent,
    MouViewTcComponent,
    MouViewComponent,
    MouViewApprovalHistoryComponent,
    //surveyView prototype
    SurveyViewComponent
  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent,
    UcgridviewComponent,
    UcapprovalhistComponent
  ]

})
export class ViewModule { }