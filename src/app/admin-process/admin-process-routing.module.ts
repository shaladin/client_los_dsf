import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPagingComponent } from './purchase-order/purchase-order-paging/purchase-order-paging.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { DeliveryOrderDetailComponent } from './delivery-order/delivery-order-detail/delivery-order-detail.component';
import { DeliveryOrderPagingComponent } from './delivery-order/delivery-order-paging/delivery-order-paging.component';

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
        path: 'DeliveryOrder/Detail',
        component: DeliveryOrderDetailComponent,
        data: {
          title: 'Delivery Order'
        }
      },
      {
        path: 'DeliveryOrder/Paging',
        component: DeliveryOrderPagingComponent,
        data: {
          title: 'Delivery Order'
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
