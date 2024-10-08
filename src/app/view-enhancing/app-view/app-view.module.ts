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
import { UclookupgenericComponent, UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { UcapprovalhistModule, UcapprovalhistComponent } from "@adins/ucapprovalhist";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { AppMainInfoComponent } from "../app-main-info/app-main-info.component";
import { AppViewComponent } from "./app-view.component";
import { AppViewRoutingModule } from "./app-view-routing.module";
import { TabReferantorComponent } from "./tab-referantor/tab-referantor.component";
import { TabApplicationComponent } from "./tab-application/tab-application.component";
import { TabAppDataComponent } from "./tab-application-data/tab-app-data.component";
import { InvoiceViewComponent } from "./invoice/invoice-view/invoice-view.component";
import { InvoiceDetailComponent } from "./invoice/invoice-detail/invoice-detail.component";
import { ViewCollateralDataComponent } from "./view-collateral-data/view-collateral-data.component";
import { ViewCollateralMultiAssetComponent } from "./view-collateral-multi-asset/view-collateral-multi-asset.component";
import { ViewInsuranceComponent } from "./view-insurance/view-insurance.component";
import { AppInsuranceComponent } from "./app-insurance/app-insurance.component";
import { AppAssetDataComponent } from "./app-asset-data/app-asset-data.component";
import { AppAssetDataDetailComponent } from "./app-asset-data/app-asset-data-detail/app-asset-data-detail.component";
import { LifeInsuranceComponent } from "./life-insurance/life-insurance.component";
import { ViewFinancialComponent } from "./view-financial/view-financial.component";
import { AppTcComponent } from "./app-tc/app-tc.component";
import { TabCommissionComponent } from "./tab-commission/tab-commission.component";
import { ListDataCommissionComponent } from "./tab-commission/list-data-commission/list-data-commission.component";
import { ViewPhoneVerifComponent } from "./view-phone-verif/view-phone-verif.component";
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { TabAnalysisResultComponent } from "./tab-analysis-result/tab-analysis-result.component";
import { ApprovalHistComponent } from "./approval-hist/approval-hist.component";
import { ViewSurveyTaskListComponent } from "./view-survey-task-list/view-survey-task-list.component";
import { ViewAssetDataComponent } from "./view-asset-data/view-asset-data.component";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { SharedModule } from "app/shared/shared.module";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ViewAssetExpenseComponent } from './view-asset-expense/view-asset-expense.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { AppCustDataPersonalOplComponent } from './app-cust-data/app-cust-data-personal-opl/app-cust-data-personal-opl.component';
import { AppCustDataCompanyOplComponent } from './app-cust-data/app-cust-data-company-opl/app-cust-data-company-opl.component';
import { ViewSharingComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-sharing-component.module";
import { TabDeviationComponent } from "./tab-deviation/tab-deviation.component";
import { AppViewInsuranceDetailComponent } from "./app-insurance/app-insurance-detail/app-insurance-detail.component";
import { ViewSrvyTaskComponent } from "./view-srvy-task/view-srvy-task.component";
import { TabApplicationXComponent } from "app/impl/view-enhancing/app-view/tab-application/tab-application-x.component";
import { AppViewXComponent } from "app/impl/view-enhancing/app-view/app-view-x.component";
import { ViewSrvyTaskXComponent } from "app/impl/view-enhancing/app-view/view-srvy-task-x/view-srvy-task-x.component";
import { ApprovalHistXComponent } from 'app/impl/view-enhancing/app-view/approval-hist/approval-hist-x.component';
import { ViewCreditProcessFlowComponent } from './view-credit-process-flow/view-credit-process-flow.component';
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { ViewDeviationComponent } from "./view-deviation/view-deviation.component";
import { AppMainInfoXComponent } from "../app-main-info-x/app-main-info-x.component";
import { TabCommissionXComponent } from "app/impl/view-enhancing/app-view/tab-commission/tab-commission-x.component";
import { TabReferantorMultiComponent } from "./tab-referantor-multi/tab-referantor-multi.component";
import { TabReferantorMultiDetailComponent } from "./tab-referantor-multi-detail/tab-referantor-multi-detail.component";
import { TabAnalysisResultHistoryComponent } from "./tab-analysis-result-history/tab-analysis-result-history.component";
import { TabAnalysisResultHistoryDetailComponent } from "./tab-analysis-result-history-detail/tab-analysis-result-history-detail.component";
import { CreditReviewComponentModule } from "app/NEW-NAP/sharing-component/credit-review-component/credit-review-component.module";
import { TabDeviationHistoryComponent } from "./tab-deviation-history/tab-deviation-history.component";
import { ListDataCommissionXComponent } from "app/impl/view-enhancing/app-view/tab-commission/list-data-commission/list-data-commission-x.component";
import { ViewAssetDataXComponent } from "app/impl/view-enhancing/app-view/view-asset-data/view-asset-data-x.component";
import { AppInsuranceXComponent } from "app/impl/view-enhancing/app-view/app-insurance/app-insurance-x.component";
import { AppViewInsuranceDetailXComponent } from "app/impl/view-enhancing/app-view/app-insurance/app-insurance-detail/app-insurance-detail-x.component";
import { TabAnalysisResultHistoryXComponent } from "app/impl/view-enhancing/app-view/tab-analysis-result-history-x/tab-analysis-result-history-x.component";
import { CreditReviewCrDetailHistoryComponent } from "./credit-review-cr-detail-history/credit-review-cr-detail-history.component";
import { CreditReviewCrDetailHistoryXComponent } from "app/impl/view-enhancing/app-view/credit-review-cr-history-x/credit-review-cr-detail-history-x/credit-review-cr-detail-history-x.component";
import { CreditReviewCrDetailHistoryXDsfComponent } from "app/impl/view-enhancing/app-view/credit-review-cr-history-x-dsf/credit-review-cr-detail-history-x-dsf/credit-review-cr-detail-history-x-dsf.component";
import { TabAnalysisResultHistoryXDsfComponent } from "app/impl/view-enhancing/app-view/tab-analysis-result-history-x-dsf/tab-analysis-result-history-x-dsf.component";


@NgModule({
    imports: [
        AppViewRoutingModule,
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
        UcapprovalHistoryModule,
        UcShowErrorsModule,
        AppCustViewComponentsModule,
        ViewSharingComponentModule,
        SharedModule,
        AdInsSharedModule,
        CreditReviewComponentModule
    ],
    declarations: [
        AppMainInfoComponent,
        AppMainInfoXComponent,
        AppViewComponent,
        TabReferantorComponent,
        TabApplicationComponent,
        TabAppDataComponent,
        InvoiceViewComponent,
        InvoiceDetailComponent,
        ViewCollateralDataComponent,
        ViewCollateralMultiAssetComponent,
        ViewInsuranceComponent,
        AppInsuranceComponent,
        AppAssetDataComponent,
        AppAssetDataDetailComponent,
        LifeInsuranceComponent,
        ViewFinancialComponent,
        AppTcComponent,
        TabCommissionComponent,
        ListDataCommissionComponent,
        ViewPhoneVerifComponent,
        ViewReservedFundComponent,
        TabAnalysisResultComponent,
        ApprovalHistComponent,
        ViewSurveyTaskListComponent,
        ViewAssetDataComponent,
        ViewAssetDataXComponent,
        TabDeviationComponent,
        ViewAssetExpenseComponent,
        ViewSurveyComponent,
        AppCustDataPersonalOplComponent,
        AppCustDataCompanyOplComponent,
        AppViewInsuranceDetailComponent,
        ViewSrvyTaskComponent,
        TabApplicationXComponent,
        AppViewXComponent,
        ViewSrvyTaskXComponent,
        ApprovalHistXComponent,
        ViewCreditProcessFlowComponent,
        ViewDeviationComponent,
        TabCommissionXComponent,
        TabReferantorMultiComponent,
        TabReferantorMultiDetailComponent,
        TabAnalysisResultHistoryComponent,
        TabAnalysisResultHistoryDetailComponent,
        CreditReviewCrDetailHistoryComponent,
        TabDeviationHistoryComponent,
        ListDataCommissionXComponent,
        AppInsuranceXComponent,
        AppViewInsuranceDetailXComponent,
        TabAnalysisResultHistoryXComponent,
        TabAnalysisResultHistoryXDsfComponent,
        CreditReviewCrDetailHistoryXComponent,
        CreditReviewCrDetailHistoryXDsfComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
        AppMainInfoComponent,
        AppAssetDataDetailComponent,
        TabReferantorMultiDetailComponent,
        AppMainInfoXComponent,
        AppAssetDataDetailComponent,
        AppViewInsuranceDetailXComponent
    ],
    exports: [
        AppMainInfoComponent
    ]
})
export class AppViewModule { }
