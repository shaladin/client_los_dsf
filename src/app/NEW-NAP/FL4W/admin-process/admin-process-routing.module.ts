import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPagingFl4wComponent } from './purchase-order/purchase-order-paging-fl4w/purchase-order-paging-fl4w.component';

const routes: Routes = [
  {
    path: 'PurchaseOrder/Paging',
    component: PurchaseOrderPagingFl4wComponent,
    data: {
      title: 'Purchase Order Paging'
    }
  },
  // {
  //   path: 'PurchaseOrder/PO',
  //   component: PurchaseOrderComponent,
  //   data: {
  //     title: 'Purchase Order'
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessFL4WRoutingModule { }
