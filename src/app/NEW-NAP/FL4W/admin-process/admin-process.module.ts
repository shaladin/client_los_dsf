import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessFL4WRoutingModule } from "./admin-process-routing.module";
import { PurchaseOrderPagingFl4wComponent } from './purchase-order/purchase-order-paging-fl4w/purchase-order-paging-fl4w.component';
import { PurchaseOrderFl4wComponent } from './purchase-order/purchase-order-fl4w/purchase-order-fl4w.component';
import { PurchaseOrderDetailFl4wComponent } from './purchase-order/purchase-order-detail-fl4w/purchase-order-detail-fl4w.component';
import { AdminProcessSharingModule } from "app/NEW-NAP/business-process/admin-process/admin-process.module";
import { AdInsSharedModule } from "app/components/adins-module/AdInsShared.Module";
 

@NgModule({
  imports: [
    CommonModule,
    AdminProcessFL4WRoutingModule,
    AdInsModule,
    AdInsSharedModule,
    AdminProcessSharingModule,
  ],
  declarations: [
    DummyComponent,
    PurchaseOrderPagingFl4wComponent,
    PurchaseOrderFl4wComponent,
    PurchaseOrderDetailFl4wComponent, 
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessFL4WModule { }