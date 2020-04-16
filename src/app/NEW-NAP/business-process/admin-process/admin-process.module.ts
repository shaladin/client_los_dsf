import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessSharingRoutingModule } from "./admin-process-routing.module";
import { PurchaseOrderPagingComponent } from "./purchase-order/purchase-order-paging/purchase-order-paging.component";
import { PurchaseOrderComponent } from "./purchase-order/purchase-order/purchase-order.component";
import { PurchaseOrderDetailComponent } from "./purchase-order/purchase-order-detail/purchase-order-detail.component";
import { CustConfirmationPagingComponent } from "./cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component";
import { CustConfirmationDetailComponent } from "./cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component";
import { CustConfirmationSubjDetailComponent } from "./cust-confirmation/cust-confirmation-subj-detail/cust-confirmation-subj-detail.component";
import { CustConfirmationSubjViewComponent } from "./cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component";
import { DeliveryOrderDetailComponent } from "./delivery-order/delivery-order-detail/delivery-order-detail.component";
import { DeliveryOrderPagingComponent } from "./delivery-order/delivery-order-paging/delivery-order-paging.component";
import { PreGoLivePagingComponent } from "./pre-go-live/pre-go-live-paging/pre-go-live-paging.component";
import { PreGoLiveComponent } from "./pre-go-live/pre-go-live/pre-go-live.component";
import { PreGoLiveRequestForApprovalComponent } from "./pre-go-live/pre-go-live-request-for-approval/pre-go-live-request-for-approval.component";
import { TcSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/tc-sharing-component.module";
import { ApplicationAgreementCancellationPagingComponent } from "./application-agreement-cancellation/application-agreement-cancellation-paging/application-agreement-cancellation-paging.component";
import { ApplicationAgreementCancellationDetailComponent } from "./application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail.component";
import { AgrmntActivationPagingComponent } from "./agrmnt-activation/agrmnt-activation-paging/agrmnt-activation-paging.component";
import { AgrmntActivationDetailComponent } from "./agrmnt-activation/agrmnt-activation-detail/agrmnt-activation-detail.component";
import { OfferingValidityCheckingApprovalPagingComponent } from "./offering-validity-checking-approval/offering-validity-checking-approval-paging/offering-validity-checking-approval-paging.component";
import { OfferingValidityCheckingApprovalDetailComponent } from "./offering-validity-checking-approval/offering-validity-checking-approval-detail/offering-validity-checking-approval-detail.component";
import { DocSignerPagingComponent } from "./doc-signer/doc-signer-paging/doc-signer-paging.component";
import { DocSignerDetailComponent } from "./doc-signer/doc-signer-detail/doc-signer-detail.component";
import { InvoiceViewComponent } from "./invoice/invoice-view/invoice-view.component";
import { InvoiceDetailComponent } from "./invoice/invoice-detail/invoice-detail.component";
import { AgreementViewContainerComponent } from "./agreement-view-container/agreement-view-container.component";
import { DocumentPagingComponent } from "./document-printing/document-paging/document-paging.component";
import { DocumentViewComponent } from "./document-printing/document-view/document-view.component";
import { InvoiceDataAddComponent } from "./invoice-data/invoice-data-add/invoice-data-add.component";

@NgModule({
  imports: [
    CommonModule,
    AdminProcessSharingRoutingModule,
    TcSharingComponentModule,
    AdInsModule,
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
    DeliveryOrderPagingComponent,
    PreGoLivePagingComponent,
    PreGoLiveComponent,
    PreGoLiveRequestForApprovalComponent,
    ApplicationAgreementCancellationPagingComponent,
    ApplicationAgreementCancellationDetailComponent,
    AgrmntActivationPagingComponent,
    AgrmntActivationDetailComponent,
    OfferingValidityCheckingApprovalPagingComponent,
    OfferingValidityCheckingApprovalDetailComponent,
    DocSignerDetailComponent,
    DocSignerPagingComponent,
    InvoiceViewComponent,
    InvoiceDetailComponent,
    AgreementViewContainerComponent,
    DocumentPagingComponent,
    DocumentViewComponent,
    InvoiceDataAddComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessSharingModule { }