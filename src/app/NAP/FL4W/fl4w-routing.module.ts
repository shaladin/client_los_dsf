import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';
import { PurchaseOrderPagingComponent } from 'app/NEW-NAP/FL4W/admin-process/purchase-order/purchase-order-paging/purchase-order-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dummy',
        component: DummyComponent,
        data: {
          title: 'dummy'
        }
      },
      {
        path: 'PurchaseOrder/Paging',
        component: PurchaseOrderPagingComponent,
        data: {
          title: 'Purchase Order Paging'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FL4WRoutingModule { }
