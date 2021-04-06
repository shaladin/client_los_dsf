import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { SharedModule } from "app/shared/shared.module";
import { ReportMarketingComponent } from './report-marketing/report-marketing.component';
import { UcreportModule } from "@adins/ucreport";
import { ReportAppPendingComponent } from "./report-app-pending/report-app-pending.component";
import { RentalSummaryComponent } from "./report-rental-summary/rental-summary.component";
import { RentalDetailComponent } from "./report-rental-detail/rental-detail.component";
import { RentalDetailBrandTypeModelReportComponent } from "./report-rental-detail/rental-detail-brand-type-model/rental-detail-brand-type-model.component";
import { RentalDetailMarketingReportComponent } from "./report-rental-detail/rental-detail-marketing/rental-detail-marketing.component";
import { RentalDetailProductReportComponent } from "./report-rental-detail/rental-detail-product/rental-detail-product.component";
import { RentalSummaryBrandTypeModelReportComponent } from "./report-rental-summary/rental-summary-brand-type-model/rental-summary-brand-type-model.component";
import { RentalSummaryMarketingReportComponent } from "./report-rental-summary/rental-summary-marketing/rental-summary-marketing.component";
import { RentalSummaryProductReportComponent } from "./report-rental-summary/rental-summary-product/rental-summary-product.component";
import { RentalSummarySupplierReportComponent } from "./report-rental-summary/rental-summary-supplier/rental-summary-supplier.component";
import { RentalDetailSupplierReportComponent } from "./report-rental-detail/rental-detail-supplier/rental-detail-supplier.component";
import { ReportRoutingModule } from "./report-routing.module";

@NgModule({
    declarations: [

    ReportMarketingComponent,
    ReportAppPendingComponent,
    RentalSummaryComponent,
    RentalDetailComponent,
    RentalDetailBrandTypeModelReportComponent,
    RentalDetailMarketingReportComponent,
    RentalDetailProductReportComponent,
    RentalDetailSupplierReportComponent,
    RentalSummaryBrandTypeModelReportComponent,
    RentalSummaryMarketingReportComponent,
    RentalSummaryProductReportComponent,
    RentalSummarySupplierReportComponent
    ],
    imports: [
        ReportRoutingModule,
        CommonModule,
        MatRadioModule,
        AdInsModule,
        UcSubsectionModule,
        ViewAppComponentModule,
        SharedModule,
        UcreportModule
    ],
    providers: [
        NGXToastrService
    ]
})

export class ReportModule { }