import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { UclookupgenericComponent, UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { UcapprovalhistModule, UcapprovalhistComponent } from "@adins/ucapprovalhist";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { ViewRoutingModule } from "./view-routing.module";
import { LeadMainInfoComponent } from "./lead-main-info/lead-main-info.component";
import { MouMainInfoComponent } from './mou-main-info/mou-main-info.component';
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { SharedModule } from "app/shared/shared.module";
import { AgrViewModule } from "./agr-view/agr-view.module";
import { AppViewModule } from "./app-view/app-view.module";
import { LeadViewModule } from "./lead-view/lead-view.module";
import { ChangeMouViewModule } from "./change-mou-view/change-mou-view.module";
import { POViewModule } from "./purchase-order-view/purchase-order-view.module";
import { SurveyViewModule } from "./survey-view-prototype/survey-view.module";


@NgModule({
  imports: [
    ViewRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    UclookupgenericModule,
    UcviewgenericModule,
    UcgridviewModule,
    NgbModule,
    SharingModule,
    ArchwizardModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule,
    UcapprovalhistModule,
    UcShowErrorsModule,
    UcapprovalHistoryModule,
    AppCustViewComponentsModule,
    SharedModule,
    AgrViewModule,
    AppViewModule,
    ChangeMouViewModule,
    LeadViewModule,
    POViewModule,
    SurveyViewModule,
  ],
  declarations: [
    LeadMainInfoComponent,
    MouMainInfoComponent,
  ],
  providers: [
    NGXToastrService
],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent,
    UcgridviewComponent,
    UcapprovalhistComponent,
  ],
  exports: [
    MouMainInfoComponent
  ]

})
export class ViewModule { }