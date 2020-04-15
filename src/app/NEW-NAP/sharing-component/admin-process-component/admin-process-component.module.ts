import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TcSharingComponentModule } from "../input-nap-component/tc-sharing-component.module";
import { ViewMainInfoComponentModule } from "../view-main-info-component/view-main-info-component.module";
import { PurchaseOrderDetailComponent } from "./purchase-order/purchase-order-detail/purchase-order-detail.component";
import { CustConfirmationPagingComponent } from "./cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component";
import { CustConfirmationDetailComponent } from "./cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component";
import { CustConfirmationSubjDetailComponent } from "./cust-confirmation/cust-confirmation-subj-detail/cust-confirmation-subj-detail.component";
import { CustConfirmationSubjViewComponent } from "./cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component";
import { DeliveryOrderDetailComponent } from "./delivery-order/delivery-order-detail/delivery-order-detail.component";
import { DeliveryOrderPagingComponent } from "./delivery-order/delivery-order-paging/delivery-order-paging.component";
import { PreGoLiveComponent } from "./pre-go-live/pre-go-live-sharing/pre-go-live.component";
import { PreGoLiveRequestForApprovalComponent } from "./pre-go-live/pre-go-live-request-for-approval-sharing/pre-go-live-request-for-approval.component";
import { PurchaseOrderComponent } from "./purchase-order/purchase-order/purchase-order.component";

@NgModule({
  exports: [
    PurchaseOrderComponent,
    PurchaseOrderDetailComponent,
    CustConfirmationPagingComponent,
    CustConfirmationDetailComponent,
    CustConfirmationSubjDetailComponent,
    CustConfirmationSubjViewComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderPagingComponent,
    PreGoLiveComponent,
    PreGoLiveRequestForApprovalComponent,
  ],
  imports: [
    CommonModule,
    AdInsModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule
  ],
  declarations: [
    PurchaseOrderComponent,
    PurchaseOrderDetailComponent,
    CustConfirmationPagingComponent,
    CustConfirmationDetailComponent,
    CustConfirmationSubjDetailComponent,
    CustConfirmationSubjViewComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderPagingComponent,
    PreGoLiveComponent,
    PreGoLiveRequestForApprovalComponent,
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessComponentModule { }