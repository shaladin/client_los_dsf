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
import { ViewInsuranceDetailComponent } from "./agr-view/view-insurance-detail/view-insurance-detail.component";
import { AppInsuranceDetailComponent } from "./app-view/app-insurance/app-insurance-detail/app-insurance-detail.component";
import { LeadMainInfoComponent } from "./lead-main-info/lead-main-info.component";
import { FraudDetectionDataModule } from "app/NEW-NAP/business-process/credit-process/credit-review/fraud-detection-data/fraud-detection-data.module";
import { MouMainInfoComponent } from './mou-main-info/mou-main-info.component';

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
    FraudDetectionDataModule
  ],
  declarations: [
    ViewInsuranceDetailComponent,
    AppInsuranceDetailComponent,
    LeadMainInfoComponent,
    MouMainInfoComponent,
  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent,
    UcgridviewComponent,
    UcapprovalhistComponent,
    AppInsuranceDetailComponent
  ],
  exports: [
    MouMainInfoComponent
  ]

})
export class ViewModule { }