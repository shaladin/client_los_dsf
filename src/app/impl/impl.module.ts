import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MatRadioModule, MatTabsModule } from "@angular/material";
import { CurrencyMaskInputMode } from "ngx-currency";
import { CessieMonitoringComponent } from "./cessie/cessie-upload/cessie-monitoring.component";
import { ImplRoutingModule } from "./impl-routing.component";
import { CessieMainInfoComponent } from "./view-enhancing/cessie-view/cessie-main-info/cessie-main-info.component";
import { FactoringReviewPagingComponent } from "./cessie/factoring-review/factoring-review-paging/factoring-review-paging.component";
import { FactoringReviewAssignProductComponent } from "./cessie/factoring-review/factoring-review-detail/factoring-review-assign-product/factoring-review-assign-product.component";
import { FactoringReviewDetailComponent } from "./cessie/factoring-review/factoring-review-detail/factoring-review-detail.component";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { SharedModule } from "app/shared/shared.module";
import { CessiePreGoLivePagingComponent } from "./cessie/pre-go-live/pre-go-live-paging/pre-go-live-paging.component";
import { CessiePreGoLiveComponent } from "./cessie/pre-go-live/pre-go-live/pre-go-live.component";
import { CessiePreGoLiveApprovalPagingComponent } from "./cessie/pre-go-live/pre-go-live-approval-paging/pre-go-live-approval-paging.component";
import { CessiePreGoLiveApprovalDetailComponent } from "./cessie/pre-go-live/pre-go-live-approval-detail/pre-go-live-approval-detail.component";
import { SalesOrderComponent } from "./cessie/sharing-component/sales-order/sales-order.component";
import { CessieSummaryComponent } from "./view-enhancing/cessie-view/cessie-summary/cessie-summary.component";
import { CessieCancellationDetailComponent } from "./cessie/cessie-cancel/detail/cessie-cancel-detail.component";
import { CessieCancellationPagingComponent } from "./cessie/cessie-cancel/paging/cessie-cancel-paging.component";
import { TcSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/tc-sharing-component.module";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { CustHistoryComponent } from "app/NEW-NAP/business-process/credit-process/shared-component/cust-history/cust-history.component";
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
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  imports: [
    ImplRoutingModule,
    CommonModule,
    MatRadioModule,
    AdInsModule,
    UcSubsectionModule,
    SharedModule,
    TcSharingComponentModule,
    UcapprovalcreateModule,
    UcapprovalHistoryModule,
    UcapprovalR3Module,
    UcapprovalgeneralinfoModule,
    MatTabsModule,
    AppCustViewComponentsModule
  ],
  declarations: [
    CessieMonitoringComponent,
    CessieMainInfoComponent,
    FactoringReviewPagingComponent,
    FactoringReviewAssignProductComponent,
    FactoringReviewDetailComponent,

    CessiePreGoLivePagingComponent,
    CessiePreGoLiveComponent,
    CessiePreGoLiveApprovalPagingComponent,
    CessiePreGoLiveApprovalDetailComponent,
    SalesOrderComponent,
    CessieSummaryComponent,
    CessieCancellationPagingComponent,
    CessieCancellationDetailComponent,
    CustHistoryComponent
  ]
})

export class ImplModule { }