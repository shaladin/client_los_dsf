import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPagingComponent } from './purchase-order/purchase-order-paging/purchase-order-paging.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { DeliveryOrderDetailComponent } from './delivery-order/delivery-order-detail/delivery-order-detail.component';
import { DeliveryOrderPagingComponent } from './delivery-order/delivery-order-paging/delivery-order-paging.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { ApplicationAgreementCancellationPagingComponent } from './application-agreement-cancellation/application-agreement-cancellation-paging/application-agreement-cancellation-paging.component';
import { ApplicationAgreementCancellationDetailComponent } from './application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail.component';
import { CustConfirmationPagingComponent } from './cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component';
import { CustConfirmationDetailComponent } from './cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component';
import { CustConfirmationSubjViewComponent } from './cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component';

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
        path: 'PreGoLive',
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
      }
      ,
      {
        path: 'AgreementCancellation/Paging',
        component: ApplicationAgreementCancellationPagingComponent,
        data: {
          title: 'Agreement Cancellation Paging'
        }
      }
      ,
      {
        path: 'AgreementCancellation/Detail',
        component: ApplicationAgreementCancellationDetailComponent,
        data: {
          title: 'Agreement Cancellation Detail'
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
        path: 'CustConfirmation/Paging',
        component: CustConfirmationPagingComponent,
        data: {
          title: 'Customer Confirmation Paging'
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessRoutingModule { }
