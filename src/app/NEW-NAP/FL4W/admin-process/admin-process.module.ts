import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessFL4WRoutingModule } from "./admin-process-routing.module";
import { PurchaseOrderPagingComponent } from './purchase-order/purchase-order-paging/purchase-order-paging.component';
import { AdminProcessComponentModule } from "app/NEW-NAP/sharing-component/admin-process-component/admin-process-component.module";

@NgModule({
  imports: [
    CommonModule,
    AdminProcessFL4WRoutingModule,
    AdInsModule,
    AdminProcessComponentModule
  ],
  declarations: [
    DummyComponent,
    PurchaseOrderPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessFL4WModule { }