import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcgridfooterModule } from "@adins/ucgridfooter";
// import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { PurchaseOrderPagingComponent } from "./purchase-order/purchase-order-paging/purchase-order-paging.component";
import { AdminProcessRoutingModule } from "./admin-process-routing.module";
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { PurchaseOrderInfoComponent } from './purchase-order/purchase-order-detail/purchase-order-info/purchase-order-info.component';
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { UcgridviewModule } from "@adins/ucgridview";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    UcgridviewModule,
    UcviewgenericModule,
    NgbModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    // UcShowErrorsModule,
    AdminProcessRoutingModule,
    SharingComponentModule
  ],
  declarations: [
    PurchaseOrderPagingComponent,
    PurchaseOrderDetailComponent,
    PurchaseOrderComponent,
    PurchaseOrderInfoComponent,
    PreGoLivePagingComponent,
    PreGoLiveComponent,
    PurchaseOrderInfoComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessModule { }