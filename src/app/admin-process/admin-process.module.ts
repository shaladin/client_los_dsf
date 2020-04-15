import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcapprovalModule } from "@adins/ucapproval";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { AdminProcessRoutingModule } from "./admin-process-routing.module";
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';
import { PreGoLiveComponent } from './pre-go-live/pre-go-live/pre-go-live.component';
import { UcgridviewModule } from "@adins/ucgridview";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { AgrmntActivationPagingComponent } from './agrmnt-activation/agrmnt-activation-paging/agrmnt-activation-paging.component';
import { AgrmntActivationDetailComponent } from './agrmnt-activation/agrmnt-activation-detail/agrmnt-activation-detail.component';
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ApplicationAgreementCancellationPagingComponent } from './application-agreement-cancellation/application-agreement-cancellation-paging/application-agreement-cancellation-paging.component';
import { ApplicationAgreementCancellationDetailComponent } from './application-agreement-cancellation/application-agreement-cancellation-detail/application-agreement-cancellation-detail.component';
import { OfferingValidityCheckingApprovalPagingComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-paging/offering-validity-checking-approval-paging.component';
import { OfferingValidityCheckingApprovalDetailComponent } from './offering-validity-checking-approval/offering-validity-checking-approval-detail/offering-validity-checking-approval-detail.component';
import { PreGoLiveRequestForApprovalComponent } from './pre-go-live/pre-go-live-request-for-approval/pre-go-live-request-for-approval.component';
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { DocSignerDetailComponent } from "./doc-signer/doc-signer-detail/doc-signer-detail.component";
import { DocSignerPagingComponent } from "./doc-signer/doc-signer-paging/doc-signer-paging.component";
import { NapComponentModule } from "app/NAP/nap-component/nap-component.module";
import { InvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { InvoiceDetailComponent } from './invoice/invoice-detail/invoice-detail.component';
import { AgreementViewContainerComponent } from './agreement-view-container/agreement-view-container.component';
import { SharingModule } from "app/shared/sharing.module";

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
    SharingModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    AdminProcessRoutingModule,
    NapComponentModule,
    UcviewgenericModule,
    UcapprovalModule,
    UclookupgenericModule
  ],
  declarations: [
    PreGoLivePagingComponent,
    PreGoLiveComponent,
    PreGoLiveRequestForApprovalComponent,
    ApplicationAgreementCancellationPagingComponent,
    ApplicationAgreementCancellationDetailComponent,
    AgrmntActivationPagingComponent,
    AgrmntActivationDetailComponent,
    OfferingValidityCheckingApprovalPagingComponent,
    OfferingValidityCheckingApprovalDetailComponent,
    DocSignerDetailComponent,
    DocSignerPagingComponent,
    InvoiceViewComponent,
    InvoiceDetailComponent,
    AgreementViewContainerComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessModule { }