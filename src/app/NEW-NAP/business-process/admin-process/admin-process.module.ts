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
import { DocumentPagingComponent } from "./document-printing/document-paging/document-paging.component";
import { DocumentViewComponent } from "./document-printing/document-view/document-view.component";
import { PreGoLiveApprovalDetailComponent } from "./pre-go-live/pre-go-live-approval-detail/pre-go-live-approval-detail.component";
import { PreGoLiveApprovalPagingComponent } from "./pre-go-live/pre-go-live-approval-paging/pre-go-live-approval-paging.component";
import { ViewMainInfoComponentModule } from "app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module";
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { DeliveryOrderMultiAssetComponent } from './delivery-order-multi-asset/delivery-order-multi-asset.component';
import { DeliveryOrderMultiAssetDetailComponent } from './delivery-order-multi-asset/delivery-order-multi-asset-detail/delivery-order-multi-asset-detail.component';
import { CreateDoMultiAssetComponent } from './delivery-order-multi-asset/create-do-multi-asset/create-do-multi-asset.component';
import { DoAssetDetailComponent } from './delivery-order-multi-asset/do-asset-detail/do-asset-detail.component';
import { InvoiceVerifPagingComponent } from './invoice-verif/invoice-verif-paging/invoice-verif-paging.component';
import { InvoiceVerifDetailComponent } from './invoice-verif/invoice-verif-detail/invoice-verif-detail.component';
import { SharingModule } from "app/shared/sharing.module";
import { UcapprovalModule } from "@adins/ucapproval";
import { UcapprovalhistModule } from "@adins/ucapprovalhist";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { UcaddtotempModule } from "@adins/ucaddtotemp";
import { NewPurchaseOrderComponent } from './new-purchase-order/new-purchase-order.component';
import { NewPurchaseOrderDetailComponent } from './new-purchase-order/new-purchase-order-detail/new-purchase-order-detail.component';
import { PoEntryComponent } from './new-purchase-order/new-purchase-order-detail/po-entry/po-entry.component';
import { DocSignerCfnaComponent } from './doc-signer-cfna/doc-signer-cfna.component';
import { DocSignerCfnaDetailComponent } from './doc-signer-cfna/doc-signer-cfna-detail/doc-signer-cfna-detail.component';
import { UcapprovalcreateModule } from '@adins/ucapprovalcreate';
import { UcapprovalR3Module } from '@adins/ucapproval-r3';
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { MatTabsModule } from "@angular/material";
import { SharedModule } from "app/shared/shared.module";
import { DocChecklistPagingComponent } from "./doc-checklist/doc-checklist-paging/doc-checklist-paging.component";
import { DocChecklistDetailComponent } from "./doc-checklist/doc-checklist-detail/doc-checklist-detail.component";
import { DocChecklistRequestForApprovalComponent } from "./doc-checklist/doc-checklist-request-for-approval/doc-checklist-request-for-approval.component";
import { DocChecklistApprovalPagingComponent } from "./doc-checklist/doc-checklist-approval-paging/doc-checklist-approval-paging.component";
import { DocChecklistApprovalDetailComponent } from "./doc-checklist/doc-checklist-approval-detail/doc-checklist-approval-detail.component";

export const customCurrencyMaskConfig = {     
  align: "left",     
  allowNegative: true,     
  allowZero: true,     
  decimal: ".",     
  precision: 2,     
  prefix: "",     
  suffix: "",     
  thousands: ",",     
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL };

@NgModule({
  imports: [
    CommonModule,
    AdminProcessSharingRoutingModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule,
    ProcessComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    AdInsModule,
    UcaddtotempModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule,
    MatTabsModule,
    SharedModule
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
    PreGoLiveApprovalDetailComponent,
    PreGoLiveApprovalPagingComponent,
    ApplicationAgreementCancellationPagingComponent,
    ApplicationAgreementCancellationDetailComponent,
    AgrmntActivationPagingComponent,
    AgrmntActivationDetailComponent,
    OfferingValidityCheckingApprovalPagingComponent,
    OfferingValidityCheckingApprovalDetailComponent,
    DocSignerDetailComponent,
    DocSignerPagingComponent,
    InvoiceDetailComponent,
    DocumentPagingComponent,
    DocumentViewComponent,
    DeliveryOrderMultiAssetComponent,
    DeliveryOrderMultiAssetDetailComponent,
    CreateDoMultiAssetComponent,
    DoAssetDetailComponent,
    InvoiceVerifPagingComponent,
    InvoiceVerifDetailComponent,
    NewPurchaseOrderComponent,
    NewPurchaseOrderDetailComponent,
    PoEntryComponent,
    DocSignerCfnaComponent,
    DocSignerCfnaDetailComponent,
    DocChecklistPagingComponent,
    DocChecklistDetailComponent,
    DocChecklistRequestForApprovalComponent,
    DocChecklistApprovalPagingComponent,
    DocChecklistApprovalDetailComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    CreateDoMultiAssetComponent,
    DoAssetDetailComponent,
    PoEntryComponent
  ]
})
export class AdminProcessSharingModule { }
