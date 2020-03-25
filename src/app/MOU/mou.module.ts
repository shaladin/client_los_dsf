import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
import { MainInfoComponent } from 'app/view/main-info/main-info.component';
import { MouRoutingModule } from "./mou-routing.module";
import { DocSignerComponent } from "./doc-signer/doc-signer.component";
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouReviewGeneralComponent } from './mou-customer/mou-review/mou-review-general/mou-review-general.component';
import { MouViewDetailComponent } from './mou-customer/mou-view/mou-view-detail/mou-view-detail.component';
import { MouViewFeeComponent } from './mou-customer/mou-view/mou-view-fee/mou-view-fee.component';
import { MouViewAddcollComponent } from './mou-customer/mou-view/mou-view-addcoll/mou-view-addcoll.component';
import { MouViewTcComponent } from './mou-customer/mou-view/mou-view-tc/mou-view-tc.component';
import { MouViewDocComponent } from './mou-customer/mou-view/mou-view-doc/mou-view-doc.component';
import { MouViewSurveyComponent } from './mou-customer/mou-view/mou-view-survey/mou-view-survey.component';
import { MouViewLegalComponent } from './mou-customer/mou-view/mou-view-legal/mou-view-legal.component';
import { DocSignerDetailComponent } from "./doc-signer/doc-signer-detail/doc-signer-detail.component";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
// import { ShowErrorsComponent } from "./app/test-new/show-errors.component";

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
    UcSubsectionModule,
    SharingComponentModule
  ],
  declarations: [
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
    DocSignerDetailComponent
  ],
    exports: [],
    providers: [NGXToastrService],
})

export class MouModule { }