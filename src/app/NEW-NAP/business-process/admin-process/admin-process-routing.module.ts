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
import { PreGoLiveApprovalPagingComponent } from './pre-go-live/pre-go-live-approval-paging/pre-go-live-approval-paging.component';
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
        path: PathConstant.CUST_CONFIRM_DETAIL,
        component: CustConfirmationDetailComponent,
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
        component: PreGoLiveApprovalPagingComponent,
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
        path: PathConstant.NAP_DOC_SIGNER_PAGING,
        component: DocSignerPagingComponent,
        data: {
          title: 'Document Signer Paging'
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
        path: 'AssetAllocation/Paging',
        component: AssetAllocationPagingComponent,
        data: {
          title: 'Asset Allocation Paging'
        }
      },
      {
        path: 'AssetAllocation/Detail',
        component: AssetAllocationDetailComponent,
        data: {
          title: 'Asset Allocation Detail'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessSharingRoutingModule { }
