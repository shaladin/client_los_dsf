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
import { TabDeviationComponent } from './tab-deviation/tab-deviation.component';
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ViewAssetExpenseComponent } from './view-asset-expense/view-asset-expense.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { AppCustDataPersonalOplComponent } from './app-cust-data/app-cust-data-personal-opl/app-cust-data-personal-opl.component';
import { AppCustDataCompanyOplComponent } from './app-cust-data/app-cust-data-company-opl/app-cust-data-company-opl.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

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
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        AppMainInfoComponent,
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
        TabDeviationComponent,
        ViewAssetExpenseComponent,
        ViewSurveyComponent,
        AppCustDataPersonalOplComponent,
        AppCustDataCompanyOplComponent,
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
        AppMainInfoComponent,
        AppAssetDataDetailComponent,
    ]
})
export class AppViewModule { }