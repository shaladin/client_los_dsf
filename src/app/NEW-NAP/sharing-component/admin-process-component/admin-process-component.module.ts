import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { PurchaseOrderPagingComponent } from "./purchase-order/purchase-order-paging/purchase-order-paging.component";
import { PurchaseOrderComponent } from "./purchase-order/purchase-order/purchase-order.component";
import { PurchaseOrderDetailComponent } from "./purchase-order/purchase-order-detail/purchase-order-detail.component";
import { CustConfirmationPagingComponent } from "./cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component";
import { CustConfirmationDetailComponent } from "./cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component";
import { CustConfirmationSubjDetailComponent } from "./cust-confirmation/cust-confirmation-subj-detail/cust-confirmation-subj-detail.component";
import { CustConfirmationSubjViewComponent } from "./cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component";
import { DeliveryOrderDetailComponent } from "./delivery-order/delivery-order-detail/delivery-order-detail.component";
import { DeliveryOrderPagingComponent } from "./delivery-order/delivery-order-paging/delivery-order-paging.component";
import { TcSharingComponentModule } from "../input-nap-component/tc-sharing-component.module";
import { ViewMainInfoComponentModule } from "../view-main-info-component/view-main-info-component.module";
import { RouterModule } from "@angular/router";

@NgModule({
  exports: [
    PurchaseOrderPagingComponent,
    PurchaseOrderComponent,
    PurchaseOrderDetailComponent,
    CustConfirmationPagingComponent,
    CustConfirmationDetailComponent,
    CustConfirmationSubjDetailComponent,
    CustConfirmationSubjViewComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderPagingComponent,
  ],
  imports: [
    CommonModule,
    AdInsModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule,
    RouterModule
  ],
  declarations: [
    PurchaseOrderPagingComponent,
    PurchaseOrderComponent,
    PurchaseOrderDetailComponent,
    CustConfirmationPagingComponent,
    CustConfirmationDetailComponent,
    CustConfirmationSubjDetailComponent,
    CustConfirmationSubjViewComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessComponentModule { }