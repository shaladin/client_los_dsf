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
import { MatRadioModule, MatTabsModule } from "@angular/material";
import { SharedModule } from "app/shared/shared.module";
import { DocChecklistPagingComponent } from "./doc-checklist/doc-checklist-paging/doc-checklist-paging.component";
import { DocChecklistDetailComponent } from "./doc-checklist/doc-checklist-detail/doc-checklist-detail.component";
import { DocChecklistRequestForApprovalComponent } from "./doc-checklist/doc-checklist-request-for-approval/doc-checklist-request-for-approval.component";
import { DocChecklistApprovalPagingComponent } from "./doc-checklist/doc-checklist-approval-paging/doc-checklist-approval-paging.component";
import { DocChecklistApprovalDetailComponent } from "./doc-checklist/doc-checklist-approval-detail/doc-checklist-approval-detail.component";
import { PreGoLiveOplPagingComponent } from './pre-go-live-opl/pre-go-live-opl-paging/pre-go-live-opl-paging.component';
import { PreGoLiveOplDetailComponent } from './pre-go-live-opl/pre-go-live-opl-detail/pre-go-live-opl-detail.component';
import { PreGoLiveOplService } from "./pre-go-live-opl/pre-go-live-opl.service";
import { AssetAllocationPagingComponent } from "./asset-allocation/asset-allocation-paging/asset-allocation-paging.component";
import { AssetAllocationDetailComponent } from "./asset-allocation/asset-allocation-detail/asset-allocation-detail.component";
import { InvoiceVerifDetailListOfInvoiceComponent } from "./invoice-verif/invoice-verif-detail/invoice-verif-detail-list-of-invoice/invoice-verif-detail-list-of-invoice.component";
import { InvoiceVerifDetailDFComponent } from "./invoice-verif/invoice-verif-detail/invoice-verif-detail-DF/invoice-verif-detail-DF.component";
import { DocSignerPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/doc-signer-dsf/doc-signer-paging-dsf/doc-signer-paging-dsf.component";
import { DocSignerDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/doc-signer-dsf/doc-signer-detail-dsf/doc-signer-detail-dsf.component";
import { PreGoLiveXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/pre-go-live/pre-go-live-x.component";
import { DeliveryOrderMultiAssetDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/delivery-order-multi-asset-detail/delivery-order-multi-asset-detail-x.component";
import { CustConfirmationDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/cust-confirmation/cust-confirmation-detail/cust-confirmation-detail-x.component";
import { GoLiveApprovalPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/go-live-approval-paging/go-live-approval-paging-x.component";
import { GoLiveApprovalDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/go-live-approval-detail/go-live-approval-detail-x.component";
import { EndDateForGoLiveApprovalPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/end-date-go-live-approval-paging/end-date-go-live-approval-paging-x.component";
import { EndDateForGoLiveApprovalDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/end-date-go-live-approval-detail/end-date-go-live-approval-detail-x.component";
import { InvoiceVerifDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/invoice-verif/invoice-verif-detail/invoice-verif-detail-x.component';
import { InvoiceVerifDetailDFXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/invoice-verif/invoice-verif-detail/invoice-verif-detail-DF/invoice-verif-detail-DF-x.component';
import { InvoiceVerifDetailListOfInvoiceXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/invoice-verif/invoice-verif-detail/invoice-verif-detail-list-of-invoice/invoice-verif-detail-list-of-invoice-x.component';
import { PurchaseOrderPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-paging/purchase-order-paging-x.component";
import { PurchaseOrderDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-detail/purchase-order-detail-x.component";
import { PurchaseOrderXComponent } from "app/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order/purchase-order-x.component";
import { AgrmntActivationDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/agrmnt-activation/agrmnt-activation-detail-x/agrmnt-activation-detail-x.component";
import { InsuranceOrderPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/insurance-order/insurance-order-paging/insurance-order-paging-x/insurance-order-paging-x.component";
import { InsuranceOrderDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/insurance-order/insurance-order-detail/insurance-order-detail-x/insurance-order-detail-x.component";
import { DocumentViewXComponent } from "app/impl/NEW-NAP/business-process/admin-process/document-printing/document-view/document-view-x.component";
import { AgrViewModule } from "app/view-enhancing/agr-view/agr-view.module";
import { NewPurchaseOrderDetailXComponent } from "app/impl/NEW-NAP/admin-process/new-purchase-order/new-purchase-order-detail-x/new-purchase-order-detail-x.component";
import { PoEntryXComponent } from "app/impl/NEW-NAP/admin-process/new-purchase-order/new-purchase-order-detail-x/po-entry-x/po-entry-x.component";
import { DocSignerDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/doc-signer/doc-signer-detail/doc-signer-detail-x.component";
import { DocSignerPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/doc-signer/doc-signer-paging/doc-signer-paging-x.component";
import { CreateDoMultiAssetXComponent } from "app/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/create-do-multi-asset-x/create-do-multi-asset-x.component";
import { DoAssetDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/do-asset-detail-x/do-asset-detail-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { DeliveryOrderAssetOwnerComponent } from './delivery-order-component/delivery-order-asset-owner/delivery-order-asset-owner.component';
import { DeliveryOrderAssetLocationComponent } from './delivery-order-component/delivery-order-asset-location/delivery-order-asset-location.component';
import { DeliveryOrderMultiAssetXComponent } from "app/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/delivery-order-multi-asset-x.component";
import { CustConfirmationPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/cust-confirmation/cust-confirmation-paging/cust-confirmation-paging-x.component";
import { OfferingValidityCheckingRequestPagingComponent } from "./offering-validity-checking-request/offering-validity-checking-request-paging/offering-validity-checking-request-paging.component";
import { OfferingValidityCheckingRequestDetailComponent } from "./offering-validity-checking-request/offering-validity-checking-request-detail/offering-validity-checking-request-detail.component";
import { DocumentPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/document-printing-dsf/document-paging-dsf/document-paging-dsf.component";
import { DocumentViewXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/document-printing-dsf/document-view-x-dsf/document-view-x-dsf.component";
import { ApplicationAgreementCancellationDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail-x.component";
import { InvoiceDataPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/invoice-data/invoice-data-paging/invoice-data-paging-x.component";
import { InvoiceDataXComponent } from "app/impl/NEW-NAP/business-process/admin-process/invoice-data/invoice-data/invoice-data-x.component";
import { InvoiceDataDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/invoice-data/invoice-data-detail/invoice-data-detail-x.component";
import { PreGoLiveApprovalPagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/pre-go-live-approval-paging-x/pre-go-live-approval-paging-x.component";
import { GoLiveApprovalPagingXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/go-live-approval-paging-x-dsf/go-live-approval-paging-x-dsf.component";
import { GoLiveApprovalDetailXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/go-live-approval-detail-x-dsf/go-live-approval-detail-x-dsf.component";
import { PreGoLiveApprovalPagingXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/pre-go-live-x/pre-go-live-approval-paging-x-dsf/pre-go-live-approval-paging-x-dsf.component";
import { PreGoLiveApprovalDetailDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/pre-go-live/pre-go-live-approval-detail-dsf/pre-go-live-approval-detail-dsf.component";
import { ApplicationAgreementCancellationPagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/application-agreement-cancellation-dsf/application-agreement-cancellation-paging-dsf/application-agreement-cancellation-paging-dsf.component";
import { ApplicationAgreementCancellationDetailXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/application-agreement-cancellation-x-dsf/application-agreement-cancellation-detail-x-dsf/application-agreement-cancellation-detail-x-dsf.component";
import { PreGoLivePagingDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/pre-go-live/pre-go-live-paging-dsf/pre-go-live-paging-dsf.component";
import { PreGoLiveXDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/pre-go-live-x/pre-go-live-x-dsf/pre-go-live-x-dsf.component";
import { PreGoLivePagingXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/pre-go-live-paging-x/pre-go-live-paging-x.component";
import { DeliveryOrderMultiAssetDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset-dsf/delivery-order-multi-asset-dsf.component";
import { DoAssetDetailXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset-dsf/do-asset-detail-x-dsf/do-asset-detail-x-dsf.component";
import { DeliveryOrderMultiAssetDetailXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset-dsf/delivery-order-multi-asset-detail-x-dsf/delivery-order-multi-asset-detail-x-dsf.component";
import { CreateDoMultiAssetXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset-dsf/create-do-multi-asset-x-dsf/create-do-multi-asset-x-dsf.component";
import { PreGoLiveApprovalDetailXComponent } from "app/impl/NEW-NAP/business-process/admin-process/pre-go-live/pre-go-live-approval-detail/pre-go-live-approval-detail-x.component";
import { OfferingValidityCheckingApprovalDetailXComponent } from "app/impl/NEW-NAP/admin-process/offering-validity-checking-approval/offering-validity-checking-approval-detail/offering-validity-checking-approval-detail-x.component";
import { PurchaseOrderPagingXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-paging-x-dsf/purchase-order-paging-x-dsf.component";
import { PurchaseOrderDetailXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-detail-x-dsf/purchase-order-detail-x-dsf.component";
import { PurchaseOrderXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-x-dsf/purchase-order-x-dsf.component";
import { NewPurchaseOrderDsfComponent } from "app/NEW-NAP/DSF/business-process-dsf/admin-process-dsf/new-purchase-order-dsf/new-purchase-order-dsf.component";
import { NewPurchaseOrderDetailXDsfComponent } from "app/dsf/impl/NEW-NAP/business-process/admin-process/new-purchase-order/new-purchase-order-detail-x-dsf/new-purchase-order-detail-x-dsf.component";

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    CommonModule,
    AdminProcessSharingRoutingModule,
    TcSharingComponentModule,
    ViewMainInfoComponentModule,
    ProcessComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    AdInsModule,
    AdInsSharedModule,
    UcaddtotempModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule,
    MatTabsModule,
    AgrViewModule,
    MatRadioModule,
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
    PreGoLivePagingDsfComponent,
    PreGoLiveComponent,
    PreGoLiveRequestForApprovalComponent,
    PreGoLiveApprovalDetailComponent,
    PreGoLiveApprovalDetailXComponent,
    PreGoLiveApprovalDetailDsfComponent,
    PreGoLiveApprovalPagingComponent,
    PreGoLiveApprovalPagingXComponent,
    PreGoLiveApprovalPagingXDsfComponent,
    ApplicationAgreementCancellationPagingComponent,
    ApplicationAgreementCancellationPagingDsfComponent,
    ApplicationAgreementCancellationDetailComponent,
    AgrmntActivationPagingComponent,
    AgrmntActivationDetailComponent,
    OfferingValidityCheckingApprovalPagingComponent,
    OfferingValidityCheckingApprovalDetailComponent,
    OfferingValidityCheckingApprovalDetailXComponent,
    OfferingValidityCheckingRequestPagingComponent,
    OfferingValidityCheckingRequestDetailComponent,
    DocSignerDetailComponent,
    DocSignerPagingComponent,
    DocSignerDetailXComponent,
    DocSignerPagingXComponent,
    InvoiceDetailComponent,
    DocumentPagingComponent,
    DocumentPagingDsfComponent,
    DocumentViewComponent,
    DeliveryOrderMultiAssetComponent,
    DeliveryOrderMultiAssetDsfComponent,
    DeliveryOrderMultiAssetDetailComponent,
    CreateDoMultiAssetComponent,
    DoAssetDetailComponent,
    InvoiceVerifPagingComponent,
    InvoiceVerifDetailComponent,
    NewPurchaseOrderComponent,
    NewPurchaseOrderDsfComponent,
    NewPurchaseOrderDetailComponent,
    PoEntryComponent,
    DocSignerCfnaComponent,
    DocSignerCfnaDetailComponent,
    DocChecklistPagingComponent,
    DocChecklistDetailComponent,
    DocChecklistRequestForApprovalComponent,
    DocChecklistApprovalPagingComponent,
    DocChecklistApprovalDetailComponent,
    PreGoLiveOplPagingComponent,
    PreGoLiveOplDetailComponent,
    AssetAllocationPagingComponent,
    AssetAllocationDetailComponent,
    InvoiceVerifDetailListOfInvoiceComponent,
    InvoiceVerifDetailDFComponent,
    DocSignerPagingDsfComponent,
    DocSignerDetailDsfComponent,
    PreGoLiveXComponent,
    PreGoLiveXDsfComponent,
    DeliveryOrderMultiAssetDetailXComponent,
    DeliveryOrderMultiAssetDetailXDsfComponent,
    CustConfirmationDetailXComponent,
    GoLiveApprovalPagingXComponent,
    GoLiveApprovalDetailXComponent,
    GoLiveApprovalPagingXDsfComponent,
    GoLiveApprovalDetailXDsfComponent,
    EndDateForGoLiveApprovalPagingXComponent,
    EndDateForGoLiveApprovalDetailXComponent,
    InvoiceVerifDetailXComponent,
    InvoiceVerifDetailDFXComponent,
    InvoiceVerifDetailListOfInvoiceXComponent,
    AgrmntActivationDetailXComponent,
    InsuranceOrderPagingXComponent,
    InsuranceOrderDetailXComponent,
    PurchaseOrderPagingXComponent,
    PurchaseOrderPagingXDsfComponent,
    PurchaseOrderXComponent,
    PurchaseOrderXDsfComponent,
    PurchaseOrderDetailXComponent,
    PurchaseOrderDetailXDsfComponent,
    AgrmntActivationDetailXComponent,
    DocumentViewXComponent,
    DocumentViewXDsfComponent,
    NewPurchaseOrderDetailXComponent,
    NewPurchaseOrderDetailXDsfComponent,
    PoEntryXComponent,
    CreateDoMultiAssetXComponent,
    CreateDoMultiAssetXDsfComponent,
    DoAssetDetailXComponent,
    DoAssetDetailXDsfComponent,
    DeliveryOrderAssetOwnerComponent,
    DeliveryOrderAssetLocationComponent,
    DeliveryOrderMultiAssetXComponent,
    CustConfirmationPagingXComponent,
    ApplicationAgreementCancellationDetailXComponent,
    ApplicationAgreementCancellationDetailXDsfComponent,
    PreGoLiveApprovalDetailDsfComponent,
    PreGoLiveApprovalPagingXDsfComponent,
    ApplicationAgreementCancellationPagingDsfComponent,
    ApplicationAgreementCancellationDetailXDsfComponent,
    InvoiceDataPagingXComponent,
    InvoiceDataXComponent,
    InvoiceDataDetailXComponent,
    PreGoLivePagingXComponent
  ],
  providers: [
    NGXToastrService,
    PreGoLiveOplService
  ],
  entryComponents: [
    CreateDoMultiAssetComponent,
    DoAssetDetailComponent,
    PoEntryComponent,
    PoEntryXComponent,
    CreateDoMultiAssetXComponent,
    CreateDoMultiAssetXDsfComponent,
    DoAssetDetailXComponent,
    DoAssetDetailXDsfComponent
  ]
})
export class AdminProcessSharingModule { }
