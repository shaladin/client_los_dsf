import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { PreGoLiveRequestForApprovalComponent } from './pre-go-live/pre-go-live-request-for-approval/pre-go-live-request-for-approval.component';
import { PurchaseOrderPagingComponent } from './purchase-order/purchase-order-paging/purchase-order-paging.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { DeliveryOrderPagingComponent } from './delivery-order/delivery-order-paging/delivery-order-paging.component';
import { DeliveryOrderDetailComponent } from './delivery-order/delivery-order-detail/delivery-order-detail.component';
import { CustConfirmationDetailComponent } from './cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component';
import { CustConfirmationSubjViewComponent } from './cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component';
import { ApplicationAgreementCancellationPagingComponent } from './application-agreement-cancellation/application-agreement-cancellation-paging/application-agreement-cancellation-paging.component';
import { ApplicationAgreementCancellationDetailComponent } from './application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail.component';
import { AgrmntActivationPagingComponent } from './agrmnt-activation/agrmnt-activation-paging/agrmnt-activation-paging.component';
import { AgrmntActivationDetailComponent } from './agrmnt-activation/agrmnt-activation-detail/agrmnt-activation-detail.component';
import { OfferingValidityCheckingApprovalPagingComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-paging/offering-validity-checking-approval-paging.component';
import { OfferingValidityCheckingApprovalDetailComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-detail/offering-validity-checking-approval-detail.component';
import { DocSignerPagingComponent } from './doc-signer/doc-signer-paging/doc-signer-paging.component';
import { DocSignerDetailComponent } from './doc-signer/doc-signer-detail/doc-signer-detail.component';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { PreGoLiveApprovalDetailComponent } from './pre-go-live/pre-go-live-approval-detail/pre-go-live-approval-detail.component';
import { DocumentPagingComponent } from './document-printing/document-paging/document-paging.component';
import { DocumentViewComponent } from './document-printing/document-view/document-view.component';
import { DeliveryOrderMultiAssetDetailComponent } from './delivery-order-multi-asset/delivery-order-multi-asset-detail/delivery-order-multi-asset-detail.component';
import { DeliveryOrderMultiAssetComponent } from './delivery-order-multi-asset/delivery-order-multi-asset.component';
import { InvoiceVerifPagingComponent } from './invoice-verif/invoice-verif-paging/invoice-verif-paging.component';
import { InvoiceVerifDetailComponent } from './invoice-verif/invoice-verif-detail/invoice-verif-detail.component';
import { CustConfirmationPagingComponent } from './cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component';
import { CustConfirmationSubjDetailComponent } from './cust-confirmation/cust-confirmation-subj-detail/cust-confirmation-subj-detail.component';
import { NewPurchaseOrderComponent } from './new-purchase-order/new-purchase-order.component';
import { NewPurchaseOrderDetailComponent } from './new-purchase-order/new-purchase-order-detail/new-purchase-order-detail.component';
import { DocSignerCfnaComponent } from './doc-signer-cfna/doc-signer-cfna.component';
import { DocSignerCfnaDetailComponent } from './doc-signer-cfna/doc-signer-cfna-detail/doc-signer-cfna-detail.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { DocChecklistPagingComponent } from './doc-checklist/doc-checklist-paging/doc-checklist-paging.component';
import { DocChecklistDetailComponent } from './doc-checklist/doc-checklist-detail/doc-checklist-detail.component';
import { DocChecklistRequestForApprovalComponent } from './doc-checklist/doc-checklist-request-for-approval/doc-checklist-request-for-approval.component';
import { DocChecklistApprovalPagingComponent } from './doc-checklist/doc-checklist-approval-paging/doc-checklist-approval-paging.component';
import { DocChecklistApprovalDetailComponent } from './doc-checklist/doc-checklist-approval-detail/doc-checklist-approval-detail.component';
import { PreGoLiveOplPagingComponent } from './pre-go-live-opl/pre-go-live-opl-paging/pre-go-live-opl-paging.component';
import { PreGoLiveOplDetailComponent } from './pre-go-live-opl/pre-go-live-opl-detail/pre-go-live-opl-detail.component';
import { AssetAllocationPagingComponent } from './asset-allocation/asset-allocation-paging/asset-allocation-paging.component';
import { AssetAllocationDetailComponent } from './asset-allocation/asset-allocation-detail/asset-allocation-detail.component';
import { InvoiceVerifDetailListOfInvoiceComponent } from './invoice-verif/invoice-verif-detail/invoice-verif-detail-list-of-invoice/invoice-verif-detail-list-of-invoice.component';
import { InvoiceVerifDetailDFComponent } from './invoice-verif/invoice-verif-detail/invoice-verif-detail-DF/invoice-verif-detail-DF.component';
import { PreGoLiveXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/pre-go-live/pre-go-live/pre-go-live-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { DeliveryOrderMultiAssetDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/delivery-order-multi-asset-detail/delivery-order-multi-asset-detail-x.component';
import { CustConfirmationDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/cust-confirmation/cust-confirmation-detail/cust-confirmation-detail-x.component';
import { EndDateForGoLiveApprovalPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/pre-go-live/end-date-go-live-approval-paging/end-date-go-live-approval-paging-x.component';
import { EndDateForGoLiveApprovalDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/pre-go-live/end-date-go-live-approval-detail/end-date-go-live-approval-detail-x.component';
import { GoLiveApprovalPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/pre-go-live/go-live-approval-paging/go-live-approval-paging-x.component';
import { GoLiveApprovalDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/pre-go-live/go-live-approval-detail/go-live-approval-detail-x.component';
import {InvoiceVerifDetailXComponent} from 'app/impl/NEW-NAP/business-process/admin-process/invoice-verif/invoice-verif-detail/invoice-verif-detail-x.component';
import {InvoiceVerifDetailDFXComponent} from 'app/impl/NEW-NAP/business-process/admin-process/invoice-verif/invoice-verif-detail/invoice-verif-detail-DF/invoice-verif-detail-DF-x.component';
import { PurchaseOrderDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-detail/purchase-order-detail-x.component';
import { PurchaseOrderXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order/purchase-order-x.component';
import { PurchaseOrderPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-paging/purchase-order-paging-x.component';
import { AgrmntActivationDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/agrmnt-activation/agrmnt-activation-detail-x/agrmnt-activation-detail-x.component';
import { InsuranceOrderPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/insurance-order/insurance-order-paging/insurance-order-paging-x/insurance-order-paging-x.component';
import { InsuranceOrderDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/insurance-order/insurance-order-detail/insurance-order-detail-x/insurance-order-detail-x.component';
import {InvoiceVerifDetailListOfInvoiceXComponent} from 'app/impl/NEW-NAP/business-process/admin-process/invoice-verif/invoice-verif-detail/invoice-verif-detail-list-of-invoice/invoice-verif-detail-list-of-invoice-x.component';
import { DocumentViewXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/document-printing/document-view/document-view-x.component';
import { NewPurchaseOrderDetailXComponent } from 'app/impl/NEW-NAP/admin-process/new-purchase-order/new-purchase-order-detail-x/new-purchase-order-detail-x.component';
import { DocSignerDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/doc-signer/doc-signer-detail/doc-signer-detail-x.component';
import { DocSignerPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/doc-signer/doc-signer-paging/doc-signer-paging-x.component';
import { DeliveryOrderMultiAssetXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/delivery-order-multi-asset-x.component';
import { CustConfirmationPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/cust-confirmation/cust-confirmation-paging/cust-confirmation-paging-x.component';
import { OfferingValidityCheckingRequestPagingComponent } from './offering-validity-checking-request/offering-validity-checking-request-paging/offering-validity-checking-request-paging.component';
import { OfferingValidityCheckingRequestDetailComponent } from './offering-validity-checking-request/offering-validity-checking-request-detail/offering-validity-checking-request-detail.component';
import { ApplicationAgreementCancellationDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail-x.component';
import { InvoiceDataPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/invoice-data/invoice-data-paging/invoice-data-paging-x.component';
import { InvoiceDataDetailXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/invoice-data/invoice-data-detail/invoice-data-detail-x.component';
import { InvoiceDataXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/invoice-data/invoice-data/invoice-data-x.component';
import { PreGoLiveApprovalPagingXComponent } from 'app/impl/NEW-NAP/business-process/admin-process/pre-go-live/pre-go-live-approval-paging-x/pre-go-live-approval-paging-x.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.PO_PAGING,
        component: PurchaseOrderPagingComponent,
        data: {
          title: 'Purchase Order Paging'
        }
      },
      {
        path: PathConstant.PO_PO_EXT,
        component: PurchaseOrderComponent,
        data: {
          title: 'Purchase Order'
        }
      },
      {
        path: PathConstant.PO_PO_EXT_DETAIL,
        component: PurchaseOrderDetailComponent,
        data: {
          title: 'Purchase Order Detail'
        }
      },
      {
        path: PathConstant.NEW_PO_PAGING,
        component: NewPurchaseOrderComponent,
        data: {
          title: "Purchase Order Paging"
        }
      },
      {
        path: PathConstant.NEW_PO_DETAIL,
        component: NewPurchaseOrderDetailComponent,
        data: {
          title: "Purchase Order Detail"
        }
      },
      {
        path: PathConstant.DO_PAGING,
        component: DeliveryOrderPagingComponent,
        data: {
          title: 'Delivery Order Paging'
        }
      },
      {
        path: PathConstant.DO_DETAIL,
        component: DeliveryOrderDetailComponent,
        data: {
          title: 'Delivery Order'
        }
      },
      {
        path: PathConstant.CUST_CONFIRM_PAGING,
        component: CustConfirmationPagingComponent,
        data: {
          title: 'Customer Confirmation Paging'
        }
      },
      {
        path: PathConstantX.CUST_CONFIRM_DETAIL_X,
        component: CustConfirmationDetailXComponent,
        data: {
          title: 'Customer Confirmation Detail'
        }
      },
      {
        path: PathConstant.CUST_CONFIRM_SUBJ_DETAIL,
        component: CustConfirmationSubjDetailComponent,
        data: {
          title: 'Customer Confirmation Subject Detail'
        }
      },
      {
        path: PathConstant.CUST_CONFIRM_SUBJ_VIEW,
        component: CustConfirmationSubjViewComponent,
        data: {
          title: 'Customer Confirmation Subject View'
        }
      },
      {
        path: PathConstant.PGL_PAGING,
        component: PreGoLivePagingComponent,
        data: {
          title: 'PreGoLive Paging'
        }
      },
      {
        path: PathConstant.PGL_DETAIL,
        component: PreGoLiveComponent,
        data: {
          title: 'PreGoLive Detail'
        }
      },
      {
        path: PathConstant.PGL_OPL_PAGING,
        component: PreGoLiveOplPagingComponent,
        data: {
          title: 'Pre Golive'
        }
      },
      {
        path: PathConstant.PGL_OPL_DETAIL,
        component: PreGoLiveOplDetailComponent,
        data: {
          title: 'Pre Golive Detail'
        }
      },
      {
        path: PathConstant.PGL_REQ_APPRVL,
        component: PreGoLiveRequestForApprovalComponent,
        data: {
          title: 'PreGoLive Request For Approval'
        }
      },
      {
        path: PathConstant.PGL_APPRVL_PAGING,
        component: PreGoLiveApprovalPagingXComponent,
        data: {
          title: 'PreGoLive Paging For Approval'
        }
      },
      {
        path: PathConstant.PGL_APPRVL_DETAIL,
        component: PreGoLiveApprovalDetailComponent,
        data: {
          title: 'PreGoLive Detail For Approval'
        }
      },
      {
        path: PathConstant.AGRMNT_CANCEL_PAGING,
        component: ApplicationAgreementCancellationPagingComponent,
        data: {
          title: 'Agreement Cancellation Paging'
        }
      },
      {
        path: PathConstant.AGRMNT_CANCEL_DETAIL,
        component: ApplicationAgreementCancellationDetailComponent,
        data: {
          title: 'Agreement Cancellation Detail'
        }
      },
      {
        path: PathConstant.AGRMNT_ACT_PAGING,
        component: AgrmntActivationPagingComponent,
        data: {
          title: 'Agreement Activation Paging'
        }
      },
      {
        path: PathConstant.AGRMNT_ACT_DETAIL,
        component: AgrmntActivationDetailComponent,
        data: {
          title: 'Agreement Activation Detail'
        }
      },
      {
        path: PathConstantX.AGRMNT_ACT_DETAIL,
        component: AgrmntActivationDetailXComponent,
        data: {
          title: 'Agreement Activation Detail'
        }
      },
      {
        path: PathConstant.OFFERING_VALIDITY_APPRV_PAGING,
        component: OfferingValidityCheckingApprovalPagingComponent,
        data: {
          title: 'Offering Validity Checking And Approval Paging'
        }
      },
      {
        path: PathConstant.OFFERING_VALIDITY_APPRV_DETAIL,
        component: OfferingValidityCheckingApprovalDetailComponent,
        data: {
          title: 'Offering Validity Checking And Approval Detail'
        }
      },
      {
        path: PathConstant.OFFERING_VALIDITY_REQ_PAGING,
        component: OfferingValidityCheckingRequestPagingComponent,
        data: {
          title: 'Offering Validity Request Paging'
        }
      },
      {
        path: PathConstant.OFFERING_VALIDITY_REQ_DETAIL,
        component: OfferingValidityCheckingRequestDetailComponent,
        data: {
          title: 'Offering Validity Request Detail'
        }
      },
      {
        path: PathConstant.NAP_DOC_SIGNER_PAGING,
        component: DocSignerPagingComponent,
        data: {
          title: 'Document Signer Paging'
        }
      },
      {
        path: PathConstantX.NAP_DOC_SIGNER_PAGING_X,
        component: DocSignerPagingXComponent,
        data: {
          title: 'Document Signer Paging X'
        }
      },
      {
        path: PathConstant.NAP_DOC_SIGNER_DETAIL,
        component: DocSignerDetailComponent,
        data: {
          title: 'Document Signer Detail'
        }
      },
      {
        path: PathConstantX.NAP_DOC_SIGNER_DETAIL_X,
        component: DocSignerDetailXComponent,
        data: {
          title: 'Document Signer Detail X'
        }
      },
      {
        path: PathConstant.NAP_CFNA_DOC_SIGNER_PAGING,
        component: DocSignerCfnaComponent,
        data: {
          title: 'Document Signer Paging'
        }
      },
      {
        path: PathConstant.NAP_CFNA_DOC_SIGNER_DETAIL,
        component: DocSignerCfnaDetailComponent,
        data: {
          title: 'Document Signer Detail'
        }
      },
      {
        path: PathConstant.INVOICE_DETAIL,
        component: InvoiceDetailComponent,
        data: {
          title: 'Invoice Detail'
        }
      },
      {
        path: PathConstant.NAP_DOC_PRINT_PAGING,
        component: DocumentPagingComponent,
        data: {
          title: 'Document Printing Paging'
        }
      },
      {
        path: PathConstant.NAP_DOC_PRINT_VIEW,
        component: DocumentViewComponent,
        data: {
          title: 'Document Printing View'
        }
      },
      {
        path: PathConstantX.NAP_DOC_PRINT_VIEW_X,
        component: DocumentViewXComponent,
        data: {
          title: 'Document Printing View X'
        }
      },
      {
        path: PathConstant.DO_MULTI_ASSET_PAGING,
        component: DeliveryOrderMultiAssetComponent,
        data: {
          title: 'Delivery Order Detail'
        }
      },
      {
        path: PathConstant.DO_MULTI_ASSET_DETAIL,
        component: DeliveryOrderMultiAssetDetailComponent,
        data: {
          title: 'Delivery Order Detail'
        }
      },
      {
        path: PathConstant.INVOICE_VERIF_PAGING,
        component: InvoiceVerifPagingComponent,
        data: {
          title: 'Delivery Order Paging'
        }
      },
      {
        path: PathConstant.INVOICE_VERIF_DETAIL,
        component: InvoiceVerifDetailComponent,
        data: {
          title: 'Delivery Order Detail'
        }
      },
      {
        path: PathConstantX.INVOICE_VERIF_DETAIL_X,
        component: InvoiceVerifDetailXComponent,
        data: {
          title: 'Delivery Order Detail X'
        }
      },
      {
        path: PathConstant.DOC_CHECK_LIST_PAGING,
        component: DocChecklistPagingComponent,
        data: {
          title: 'Document Checklist Paging'
        }
      },
      {
        path: PathConstant.DOC_CHECK_LIST_DETAIL,
        component: DocChecklistDetailComponent,
        data: {
          title: 'Document Checklist Detail'
        }
      },
      {
        path: PathConstant.DOC_CHECK_LIST_REQ_APPRV,
        component: DocChecklistRequestForApprovalComponent,
        data: {
          title: 'Document Checklist Request For Approval'
        }
      },
      {
        path: PathConstant.DOC_CHECK_LIST_APPRV_PAGING,
        component: DocChecklistApprovalPagingComponent,
        data: {
          title: 'Document Checklist Paging For Approval'
        }
      },
      {
        path: PathConstant.DOC_CHECK_LIST_APPRV_DETAIL,
        component: DocChecklistApprovalDetailComponent,
        data: {
          title: 'Document Checklist Detail For Approval'
        }
      },
      {
        path: PathConstant.ASSET_ALLOC_PAGING,
        component: AssetAllocationPagingComponent,
        data: {
          title: 'Asset Allocation Paging'
        }
      },
      {
        path: PathConstant.ASSET_ALLOC_DETAIL,
        component: AssetAllocationDetailComponent,
        data: {
          title: 'Asset Allocation Detail'
        }
      },
      {
        path: PathConstant.INVOICE_VERIF_DETAIL_LIST_INV,
        component: InvoiceVerifDetailListOfInvoiceComponent,
        data: {
          title: 'Invoice Detail List Of Invoice'
        }
      },
      {
        path: PathConstantX.INVOICE_VERIF_DETAIL_LIST_INV_X,
        component: InvoiceVerifDetailListOfInvoiceXComponent,
        data: {
          title: 'Invoice Detail List Of Invoice X'
        }
      },
      {
        path: PathConstant.INVOICE_VERIF_INV_DSF,
        component:InvoiceVerifDetailDFComponent,
        data:{
          title: 'Invoice Detail DF'
        }
      },
      {
        path: PathConstantX.INVOICE_VERIF_INV_DSF_X,
        component:InvoiceVerifDetailDFXComponent,
        data:{
          title: 'Invoice Detail DF X'
        }
      },
      {
        path: PathConstantX.END_DATE_GO_LIVE_APV_PAGING_X,
        component:EndDateForGoLiveApprovalPagingXComponent,
        data:{
          title: 'End Date Go Live Approval Paging'
        }
      },
      {
        path: PathConstantX.END_DATE_GO_LIVE_APV_DETAIL_X,
        component:EndDateForGoLiveApprovalDetailXComponent,
        data:{
          title: 'End Date Go Live Approval Detail'
        }
      },
      {
        path: PathConstantX.GO_LIVE_APV_PAGING_X,
        component:GoLiveApprovalPagingXComponent,
        data:{
          title: 'Go Live Approval Paging'
        }
      },
      {
        path: PathConstantX.GO_LIVE_APV_DETAIL_X,
        component:GoLiveApprovalDetailXComponent,
        data:{
          title: 'Go Live Approval Detail'
        }
      },
      {
        path: PathConstantX.DO_MULTI_ASSET_DETAIL_X,
        component: DeliveryOrderMultiAssetDetailXComponent,
        data: {
          title: 'Delivery Order'
        }
      },
      {
        path: PathConstantX.PGL_DETAIL_X,
        component: PreGoLiveXComponent,
        data: {
          title: 'PreGoLive Detail'
        }
      },
      {
        path: PathConstantX.INSURANCE_ORDER_PAGING_X,
        component: InsuranceOrderPagingXComponent,
        data: {
          title: 'Insurance Order Paging X'
        }
      },
      {
        path: PathConstantX.INSURANCE_ORDER_DETAIL_X,
        component: InsuranceOrderDetailXComponent,
        data: {
          title: 'Insurance Order Detail X'
        }
      },
      {
        path: PathConstantX.PO_PAGING_X,
        component: PurchaseOrderPagingXComponent,
        data: {
          title: 'Purchase Order Paging'
        }
      },
      {
        path: PathConstantX.PO_PO_EXT_X,
        component: PurchaseOrderXComponent,
        data: {
          title: 'Purchase Order'
        }
      },
      {
        path: PathConstantX.PO_PO_EXT_DETAIL_X,
        component: PurchaseOrderDetailXComponent,
        data: {
          title: 'Purchase Order Detail'
        }
      },
      {
        path: PathConstantX.NEW_PO_DETAIL,
        component: NewPurchaseOrderDetailXComponent,
        data: {
          title: "Purchase Order Detail"
        }
      },
      {
        path: PathConstantX.DO_MULTI_ASSET_PAGING_X,
        component: DeliveryOrderMultiAssetXComponent,
        data: {
          title: "Delivery Multi Asset Paging"
        }
      },
      {
        path: PathConstantX.CUST_CONFIRM_PAGING_X,
        component: CustConfirmationPagingXComponent,
        data: {
          title: 'Customer Confirmation Paging'
        }
      },
      {
        path: PathConstantX.AGRMNT_CANCEL_DETAIL,
        component: ApplicationAgreementCancellationDetailXComponent,
        data: {
          title: 'Agreement Cancellation Detail'
        }
      },
      {
        path: PathConstantX.INVOICE_PAGING_X,
        component: InvoiceDataPagingXComponent,
        data: {
          title: 'Invoice Data Paging'
        }
      },
      {
        path: PathConstantX.INVOICE_DETAIL_X,
        component: InvoiceDataDetailXComponent,
        data: {
          title: 'Invoice Data Detail'
        }
      },
      {
        path: PathConstantX.INVOICE_X,
        component: InvoiceDataXComponent,
        data: {
          title: 'Invoice Data'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessSharingRoutingModule { }
