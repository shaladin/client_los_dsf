import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessRFN4WRoutingModule } from "./admin-process-routing.module";
import { PreGoLivePagingComponent } from "./pre-go-live-paging/pre-go-live-paging.component";
import { PurchaseOrderPagingComponent } from "./purchase-order-paging/purchase-order-paging.component";

@NgModule({
  imports: [
    CommonModule,
    AdminProcessRFN4WRoutingModule,
    AdInsModule
  ],
  declarations: [
    PreGoLivePagingComponent,
    PurchaseOrderPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessRFN4WModule { }