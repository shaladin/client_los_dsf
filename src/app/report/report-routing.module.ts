import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PathConstant } from "app/shared/constant/PathConstant";
import { ReportMarketingComponent } from "./report-marketing/report-marketing.component";
import { ReportAppPendingComponent } from "./report-app-pending/report-app-pending.component";
import { RentalSummaryComponent } from "./report-rental-summary/rental-summary.component";
import { RentalDetailComponent } from "./report-rental-detail/rental-detail.component";
import { ReportPlafondMouSummaryComponent } from "./report-mou/report-plafond-mou-summary/report-plafond-mou-summary.component";
import { ReportPlafondMouDetailComponent } from "./report-mou/report-plafond-mou-detail/report-plafond-mou-detail.component";
import { ReportCollateralMouComponent } from "./report-mou/report-collateral-mou/report-collateral-mou.component";
import { ReportDailyIncomingAppComponent } from "./report-daily-incoming/report-daily-incoming-app/report-daily-incoming-app.component";
import { ReportLeadCancelComponent } from "./report-lead/report-lead-cancel/report-lead-cancel.component";
import { ReportDailyIncomingLeadComponent } from "./report-daily-incoming/report-daily-incoming-lead/report-daily-incoming-lead.component";
import { ReportDailyPreGoLiveByProductComponent } from "./report-daily-pre-go-live/report-daily-pre-go-live-by-product/report-daily-pre-go-live-by-product.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: PathConstant.REPORT_MARKETING, component: ReportMarketingComponent, data: { title: 'Report Marketing' } },
      { path: PathConstant.REPORT_APPLICATION_PENDING, component: ReportAppPendingComponent, data: { title: 'Report Application Pending' } },
      { path: PathConstant.REPORT_RENT_SUMMARY, component: RentalSummaryComponent, data: { title: 'Report Rental Summary' } },
      { path: PathConstant.REPORT_RENT_DETAIL, component: RentalDetailComponent, data: { title: 'Report Rental Detail' } },
      { path: PathConstant.REPORT_PLAFOND_MOU_SUMMARY, component: ReportPlafondMouSummaryComponent, data: { title: 'Report Plafond Mou Summary' } },
      { path: PathConstant.REPORT_PLAFOND_MOU_DETAIL, component: ReportPlafondMouDetailComponent, data: { title: 'Report Plafond Mou Detail' } },
      { path: PathConstant.REPORT_COLLATERAL_MOU, component: ReportCollateralMouComponent, data: { title: 'Report Collateral Mou' } },
      { path: PathConstant.REPORT_DAILY_INCOMING_APP, component: ReportDailyIncomingAppComponent, data: { title: 'Report Daily Incoming App' } },  
      { path: PathConstant.REPORT_CANCEL_LEAD, component: ReportLeadCancelComponent, data: { title: 'Report Cancel Lead' } },
      { path: PathConstant.REPORT_DAILY_INCOMING_LEAD, component: ReportDailyIncomingLeadComponent, data: { title: 'Report Daily Incoming Lead' } },
      { path: PathConstant.REPORT_DAILY_PRE_GO_LIVE_BY_PRODUCT, component: ReportDailyPreGoLiveByProductComponent, data: { title: 'Report Daily Pre Go Live By Product' } },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportRoutingModule { }