import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { PurchaseOrderPagingComponent } from "./purchase-order/purchase-order-paging/purchase-order-paging.component";
import { AdminProcessRoutingModule } from "./admin-process-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    AdminProcessRoutingModule
  ],
  declarations: [
    PurchaseOrderPagingComponent
  ]
})
export class AdminProcessModule { }