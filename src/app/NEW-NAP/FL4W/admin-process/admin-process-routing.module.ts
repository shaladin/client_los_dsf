import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPagingFl4wComponent } from './purchase-order/purchase-order-paging-fl4w/purchase-order-paging-fl4w.component';
import { PurchaseOrderFl4wComponent } from './purchase-order/purchase-order-fl4w/purchase-order-fl4w.component';
import { PurchaseOrderDetailFl4wComponent } from './purchase-order/purchase-order-detail-fl4w/purchase-order-detail-fl4w.component';

const routes: Routes = [
  {
    path: 'PurchaseOrder/Paging',
    component: PurchaseOrderPagingFl4wComponent,
    data: {
      title: 'Purchase Order Paging'
    }
  },
  {
    path: 'PurchaseOrder/PO',
    component: PurchaseOrderFl4wComponent,
    data: {
      title: 'Purchase Order'
    }
  },
  {
    path: 'PurchaseOrder/Detail',
    component: PurchaseOrderDetailFl4wComponent,
    data: {
      title: 'Purchase Order Detail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessFL4WRoutingModule { }
