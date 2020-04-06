import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
// import { UcinputnumberModule } from "@adins/ucinputnumber";
import { UCSearchComponent } from '@adins/ucsearch';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
import { MainInfoComponent } from 'app/view/main-info/main-info.component';
import { MouRoutingModule } from "./mou-routing.module";
import { DocSignerComponent } from "./doc-signer/doc-signer.component";
import { MouCustomerRequestComponent } from './mou-customer-request/mou-customer-request.component';
import { MouCustomerRequestDetailComponent } from './mou-customer-request/mou-customer-request-detail/mou-customer-request-detail.component';
import { MouCustomerDetailComponent } from "./mou-customer-request/mou-customer-detail/mou-customer-detail.component";
import { CustomerDocPrintingDetailComponent } from "./customer-doc-printing/customer-doc-printing-detail/customer-doc-printing-detail.component";
import { CustomerDocPrintingPagingComponent } from "./customer-doc-printing/customer-doc-printing-paging/customer-doc-printing-paging.component";
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouReviewGeneralComponent } from './mou-customer/mou-review/mou-review-general/mou-review-general.component';
import { MouReviewFactoringComponent } from './mou-customer/mou-review/mou-review-factoring/mou-review-factoring.component';
import { MouViewDetailComponent } from './mou-customer/mou-view/mou-view-detail/mou-view-detail.component';
import { MouViewFeeComponent } from './mou-customer/mou-view/mou-view-fee/mou-view-fee.component';
import { MouViewAddcollComponent } from './mou-customer/mou-view/mou-view-addcoll/mou-view-addcoll.component';
import { MouViewTcComponent } from './mou-customer/mou-view/mou-view-tc/mou-view-tc.component';
import { MouViewDocComponent } from './mou-customer/mou-view/mou-view-doc/mou-view-doc.component';
import { MouViewSurveyComponent } from './mou-customer/mou-view/mou-view-survey/mou-view-survey.component';
import { MouViewLegalComponent } from './mou-customer/mou-view/mou-view-legal/mou-view-legal.component';
import { DocSignerDetailComponent } from "./doc-signer/doc-signer-detail/doc-signer-detail.component";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { EditMouCustomerComponent } from "./mou-customer/edit-mou-customer/edit-mou-customer.component";
import { MouCustomerApprovalComponent } from './mou-customer/mou-customer-approval/mou-customer-approval.component';
import { MouApprovalGeneralComponent } from './mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general.component';
import { MouApprovalFactoringComponent } from './mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring.component';
import { MouRequestAddcollComponent } from './mou-customer/mou-request/mou-request-addcoll/mou-request-addcoll.component';
import { MouRequestAddcollAddeditComponent } from './mou-customer/mou-request/mou-request-addcoll-addedit/mou-request-addcoll-addedit.component';
// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";
import { LegalReviewPagingComponent } from './legal-review/legal-review-paging/legal-review-paging.component';
import { LegalReviewDetailComponent } from './legal-review/legal-review-detail/legal-review-detail.component';
@NgModule({
  imports: [
    MouRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    SharingModule,
    ArchwizardModule,
    ReactiveFormsModule,
    UcaddressModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    UclookupgenericModule,
    UcviewgenericModule,
    SharingComponentModule,
    // UcinputnumberModule
  ],
  declarations: [
    DocSignerComponent,
    MouCustomerRequestComponent,
    MouCustomerRequestDetailComponent,
    MouCustomerDetailComponent,
    CustomerDocPrintingDetailComponent,
    CustomerDocPrintingPagingComponent,
    MainInfoComponent,
    DocSignerComponent,
    MouReviewPagingComponent,
    MouReviewGeneralComponent,
    MouViewDetailComponent,
    MouViewFeeComponent,
    MouViewAddcollComponent,
    MouViewTcComponent,
    MouViewDocComponent,
    MouViewSurveyComponent,
    MouViewLegalComponent,
    MouReviewFactoringComponent,
    DocSignerDetailComponent,
    EditMouCustomerComponent,
    LegalReviewPagingComponent,
    LegalReviewDetailComponent,
    MouCustomerApprovalComponent,
    MouApprovalGeneralComponent,
    MouApprovalFactoringComponent,
    MouRequestAddcollComponent,
    MouRequestAddcollAddeditComponent
  ],
  exports: [],
  providers: [NGXToastrService],
  entryComponents: [
    // MouCustAssetDetailComponent,
    // MouCustomerApprovalComponent,
    // MouApprovalGeneralComponent,
    // MouApprovalFactoringComponent,
    // MouRequestAddcollComponent,
    // MouRequestAddcollAddeditComponent,
  ]
})

export class MouModule { }