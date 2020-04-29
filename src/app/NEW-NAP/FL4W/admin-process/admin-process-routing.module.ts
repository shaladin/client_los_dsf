import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderPagingComponent } from 'app/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-paging/purchase-order-paging.component';
import { PurchaseOrderComponent } from 'app/NEW-NAP/business-process/admin-process/purchase-order/purchase-order/purchase-order.component';
import { PurchaseOrderDetailComponent } from 'app/NEW-NAP/business-process/admin-process/purchase-order/purchase-order-detail/purchase-order-detail.component';
import { DeliveryOrderMultiAssetComponent } from 'app/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/delivery-order-multi-asset.component';
import { DeliveryOrderMultiAssetDetailComponent } from 'app/NEW-NAP/business-process/admin-process/delivery-order-multi-asset/delivery-order-multi-asset-detail/delivery-order-multi-asset-detail.component';

const routes: Routes = [
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
    path: 'PurchaseOrder/Detail',
    component: PurchaseOrderDetailComponent,
    data: {
      title: 'Purchase Order Detail'
    }
  },
  {
    path: 'DeliveryOrder/Paging',
    component: DeliveryOrderMultiAssetComponent,
    data: {
      title: 'Delivery Order Paging'
    }
  },
  {
    path: 'DeliveryOrder/Detail',
    component: DeliveryOrderMultiAssetDetailComponent,
    data: {
      title: 'Delivery Order Detail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessFL4WRoutingModule { }
