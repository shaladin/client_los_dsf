import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPagingComponent } from './purchase-order/purchase-order-paging/purchase-order-paging.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessRoutingModule { }
