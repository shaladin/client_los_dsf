import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryOrderDetailComponent } from './delivery-order/delivery-order-detail/delivery-order-detail.component';
import { DeliveryOrderPagingComponent } from './delivery-order/delivery-order-paging/delivery-order-paging.component';
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { ApplicationAgreementCancellationPagingComponent } from './application-agreement-cancellation/application-agreement-cancellation-paging/application-agreement-cancellation-paging.component';
import { ApplicationAgreementCancellationDetailComponent } from './application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail.component';
import { AgrmntActivationPagingComponent } from './agrmnt-activation/agrmnt-activation-paging/agrmnt-activation-paging.component';
import { AgrmntActivationDetailComponent } from './agrmnt-activation/agrmnt-activation-detail/agrmnt-activation-detail.component';
import { OfferingValidityCheckingApprovalPagingComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-paging/offering-validity-checking-approval-paging.component';
import { OfferingValidityCheckingApprovalDetailComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-detail/offering-validity-checking-approval-detail.component';
import { DocSignerDetailComponent } from './doc-signer/doc-signer-detail/doc-signer-detail.component';
import { DocSignerPagingComponent } from './doc-signer/doc-signer-paging/doc-signer-paging.component';
import { PreGoLiveRequestForApprovalComponent } from './pre-go-live/pre-go-live-request-for-approval/pre-go-live-request-for-approval.component';

const routes: Routes = [
  {
    path: '',
    children: [
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
        path: 'DeliveryOrder/Paging',
        component: DeliveryOrderPagingComponent,
        data: {
          title: 'Delivery Order'
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessRoutingModule { }
