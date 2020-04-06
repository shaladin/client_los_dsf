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
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { PurchaseOrderComponent } from './purchase-order/purchase-order/purchase-order.component';
import { DeliveryOrderDetailComponent } from "./delivery-order/delivery-order-detail/delivery-order-detail.component";
import { DeliveryOrderPagingComponent } from "./delivery-order/delivery-order-paging/delivery-order-paging.component";
import { PurchaseOrderInfoComponent } from './purchase-order/purchase-order-detail/purchase-order-info/purchase-order-info.component';
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { CustConfirmationPagingComponent } from './cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component';
import { CustConfirmationDetailComponent } from './cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component';
import { CustConfirmationSubjDetailComponent } from './cust-confirmation/cust-confirmation-subj-detail/cust-confirmation-subj-detail.component';
import { CustConfirmationSubjViewComponent } from './cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component';
import { CustConfirmationVerfViewComponent } from './cust-confirmation/cust-confirmation-verf-view/cust-confirmation-verf-view.component';
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { DocSignerDetailComponent } from "./doc-signer/doc-signer-detail/doc-signer-detail.component";
import { DocSignerPagingComponent } from "./doc-signer/doc-signer-paging/doc-signer-paging.component";

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
    AdminProcessRoutingModule,
    SharingComponentModule,
    UcviewgenericModule,
    UclookupgenericModule
  ],
  declarations: [
    PurchaseOrderPagingComponent,
    PurchaseOrderDetailComponent,
    PurchaseOrderComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderPagingComponent,
    PurchaseOrderInfoComponent,
    CustConfirmationPagingComponent,
    CustConfirmationDetailComponent,
    CustConfirmationSubjDetailComponent,
    CustConfirmationSubjViewComponent,
    CustConfirmationVerfViewComponent,
    DocSignerDetailComponent,
    DocSignerPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessModule { }