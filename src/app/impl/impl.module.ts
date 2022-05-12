import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MatRadioModule, MatTabsModule } from "@angular/material";
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
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
import { CessieCancellationDetailComponent } from "./cessie/cessie-cancel/detail/cessie-cancel-detail.component";
import { CessieCancellationPagingComponent } from "./cessie/cessie-cancel/paging/cessie-cancel-paging.component";
import { TcSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/tc-sharing-component.module";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { CessieInquiryComponent } from "./cessie/cessie-inquiry/cessie-inquiry.component";
import { CessieViewModule } from "./view-enhancing/cessie-view/cessie-view.module";
import { EditCommAfterApprovalInquiryPagingComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-inquiry-paging/edit-comm-after-approval-inquiry-paging.component';
import { EditCommAfterApprovalInquiryDetailComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-inquiry-detail/edit-comm-after-approval-inquiry-detail.component';

import { EditCommAfterApprovalForListDataComponent } from './NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-component/edit-comm-after-approval-for-list-data/edit-comm-after-approval-for-list-data.component';
import { EditCommAfterApprovalComponentViewDetailComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-component/edit-comm-after-approval-component-view-detail/edit-comm-after-approval-component-view-detail.component";
import { ViewMainInfoComponentModule } from "app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module";
import { EditCommAfterApprovalApprovalDetailXComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-approval-detail/edit-comm-after-approval-approval-detail-x.component";
import { EditCommAfterApprovalApprovalPagingXComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-approval-paging/edit-comm-after-approval-approval-paging-x.component";
import { EditCommAfterApprovalDetailXComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-detail/edit-comm-after-approval-detail-x.component";
import { EditCommAfterApprovalPagingXComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-after-approval-paging/edit-comm-after-approval-paging-x.component";
import { EditCommV2XComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-v2-x/edit-comm-v2-x.component";
import { FormEditCommGenerateXComponent } from "./NEW-NAP/business-process/additional-process/edit-comm-after-approval/edit-comm-v2-x/form-edit-comm-generate-x/form-edit-comm-generate-x.component";
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
    AppCustViewComponentsModule,
    ProcessComponentModule,
    CessieViewModule,
    ViewMainInfoComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
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
    CessieCancellationPagingComponent,
    CessieCancellationDetailComponent,
    CessieInquiryComponent,
    EditCommAfterApprovalInquiryPagingComponent,
    EditCommAfterApprovalInquiryDetailComponent,
    EditCommAfterApprovalComponentViewDetailComponent,
    EditCommAfterApprovalForListDataComponent,
    EditCommAfterApprovalApprovalDetailXComponent,
    EditCommAfterApprovalApprovalPagingXComponent,
    EditCommAfterApprovalDetailXComponent,
    EditCommAfterApprovalPagingXComponent,
    EditCommV2XComponent,
    FormEditCommGenerateXComponent
  ]
})

export class ImplModule { }