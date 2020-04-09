import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcapprovalModule } from "@adins/ucapproval";
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
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { UcgridviewModule } from "@adins/ucgridview";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { AgrmntActivationPagingComponent } from './agrmnt-activation/agrmnt-activation-paging/agrmnt-activation-paging.component';
import { AgrmntActivationDetailComponent } from './agrmnt-activation/agrmnt-activation-detail/agrmnt-activation-detail.component';
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ApplicationAgreementCancellationPagingComponent } from './application-agreement-cancellation/application-agreement-cancellation-paging/application-agreement-cancellation-paging.component';
import { ApplicationAgreementCancellationDetailComponent } from './application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail.component';
import { CustConfirmationPagingComponent } from './cust-confirmation/cust-confirmation-paging/cust-confirmation-paging.component';
import { CustConfirmationDetailComponent } from './cust-confirmation/cust-confirmation-detail/cust-confirmation-detail.component';
import { CustConfirmationSubjDetailComponent } from './cust-confirmation/cust-confirmation-subj-detail/cust-confirmation-subj-detail.component';
import { CustConfirmationSubjViewComponent } from './cust-confirmation/cust-confirmation-subj-view/cust-confirmation-subj-view.component';
import { CustConfirmationVerfViewComponent } from './cust-confirmation/cust-confirmation-verf-view/cust-confirmation-verf-view.component';
import { OfferingValidityCheckingApprovalPagingComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-paging/offering-validity-checking-approval-paging.component';
import { OfferingValidityCheckingApprovalDetailComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-detail/offering-validity-checking-approval-detail.component';
import { PreGoLiveRequestForApprovalComponent } from './pre-go-live/pre-go-live-request-for-approval/pre-go-live-request-for-approval.component';

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
    UcgridviewModule,
    UcviewgenericModule,
    NgbModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    AdminProcessRoutingModule,
    SharingComponentModule,
    UcviewgenericModule,
    UcapprovalModule,
    UclookupgenericModule
  ],
  declarations: [
    PurchaseOrderPagingComponent,
    PurchaseOrderDetailComponent,
    PurchaseOrderComponent,
    PreGoLivePagingComponent,
    PreGoLiveComponent,
    PreGoLiveRequestForApprovalComponent,
    ApplicationAgreementCancellationPagingComponent,
    ApplicationAgreementCancellationDetailComponent,
    AgrmntActivationPagingComponent,
    AgrmntActivationDetailComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderPagingComponent,
    CustConfirmationPagingComponent,
    CustConfirmationDetailComponent,
    CustConfirmationSubjDetailComponent,
    CustConfirmationSubjViewComponent,
    CustConfirmationVerfViewComponent,
    OfferingValidityCheckingApprovalPagingComponent,
    OfferingValidityCheckingApprovalDetailComponent,
    DocSignerDetailComponent,
    DocSignerPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessModule { }