import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { PreGoLiveRequestForApprovalComponent } from './pre-go-live/pre-go-live-request-for-approval/pre-go-live-request-for-approval.component';
import { PurchaseOrderPagingComponent } from './purchase-order/purchase-order-paging/purchase-order-paging.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
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
import { InvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { AgreementViewContainerComponent } from '../../view/agreement-view-container/agreement-view-container.component';
import { PreGoLiveApprovalPagingComponent } from './pre-go-live/pre-go-live-approval-paging/pre-go-live-approval-paging.component';
import { PreGoLiveApprovalDetailComponent } from './pre-go-live/pre-go-live-approval-detail/pre-go-live-approval-detail.component';
import { DocumentPagingComponent } from './document-printing/document-paging/document-paging.component';
import { DocumentViewComponent } from './document-printing/document-view/document-view.component';
import { InvoiceDataAddComponent } from './invoice-data/invoice-data-add/invoice-data-add.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'PurchaseOrder/Paging',
        component: PurchaseOrderPagingComponent,
        data: {
          title: 'Purchase Order Paging'
        }
      },
      {
        path: 'PurchaseOrder/PO',
        component: PurchaseOrderComponent,
        data: {
          title: 'Purchase Order'
        }
      },
      {
        path: 'PurchaseOrder/PO/Detail',
        component: PurchaseOrderDetailComponent,
        data: {
          title: 'Purchase Order Detail'
        }
      },
      {
        path: 'DeliveryOrder/Detail',
        component: DeliveryOrderDetailComponent,
        data: {
          title: 'Delivery Order'
        }
      },
      {
        path: 'CustConfirmation/Detail',
        component: CustConfirmationDetailComponent,
        data: {
          title: 'Customer Confirmation Detail'
        }
      },
      {
        path: 'CustConfirmation/Subj/View',
        component: CustConfirmationSubjViewComponent,
        data: {
          title: 'Customer Confirmation Subject View'
        }
      },
      {
        path: 'PreGoLive/Paging',
        component: PreGoLivePagingComponent,
        data: {
          title: 'PreGoLive Paging'
        }
      },
      {
        path: 'PreGoLive/Detail',
        component: PreGoLiveComponent,
        data: {
          title: 'PreGoLive Detail'
        }
      },
      {
        path: 'PreGoLive/RequestApproval',
        component: PreGoLiveRequestForApprovalComponent,
        data: {
          title: 'PreGoLive Request For Approval'
        }
      },
      {
        path: 'PreGoLive/Approval/Paging',
        component: PreGoLiveApprovalPagingComponent,
        data: {
          title: 'PreGoLive Paging For Approval'
        }
      },
      {
        path: 'PreGoLive/Approval/Detail',
        component: PreGoLiveApprovalDetailComponent,
        data: {
          title: 'PreGoLive Detail For Approval'
        }
      },
      {
        path: 'AgreementCancellation/Paging',
        component: ApplicationAgreementCancellationPagingComponent,
        data: {
          title: 'Agreement Cancellation Paging'
        }
      },
      {
        path: 'AgreementCancellation/Detail',
        component: ApplicationAgreementCancellationDetailComponent,
        data: {
          title: 'Agreement Cancellation Detail'
        }
      },
      {
        path: 'AgrmntActivation/Paging',
        component: AgrmntActivationPagingComponent,
        data: {
          title: 'Agreement Activation Paging'
        }
      },
      {
        path: 'AgrmntActivation/Detail',
        component: AgrmntActivationDetailComponent,
        data: {
          title: 'Agreement Activation Detail'
        }
      },
      {
        path: 'OfferingValidityApproval/Paging',
        component: OfferingValidityCheckingApprovalPagingComponent,
        data: {
          title: 'Offering Validity Checking And Approval Paging'
        }
      },
      {
        path: 'OfferingValidityApproval/Detail',
        component: OfferingValidityCheckingApprovalDetailComponent,
        data: {
          title: 'Offering Validity Checking And Approval Detail'
        }
      },
      {
        path: 'DocumentSigner/Paging',
        component: DocSignerPagingComponent,
        data: {
          title: 'Document Signer Paging'
        }
      },
      {
        path: 'DocumentSigner/Detail',
        component: DocSignerDetailComponent,
        data: {
          title: 'Document Signer Detail'
        }
      },
      {
        path: 'Invoice/View',
        component: InvoiceViewComponent,
        data: {
          title: 'Invoice View'
        }
      },
      {
        path: 'Invoice/Detail',
        component: InvoiceDetailComponent,
        data: {
          title: 'Invoice Detail'
        }
      },
      {
        path: 'DocPrint/Paging',
        component: DocumentPagingComponent,
        data: {
          title: 'Document Printing Paging'
        }
      },
      {
        path: 'DocPrint/View',
        component: DocumentViewComponent,
        data: {
          title: 'Document Printing View'
        }
      },
      {
        path: 'InvoiceData/Add',
        component: InvoiceDataAddComponent,
        data: {
          title: 'Invoice Data Add'
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
