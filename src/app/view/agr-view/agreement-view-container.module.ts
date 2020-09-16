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
import { AgreementViewContainerComponent } from "./agreement-view-container.component";
import { AgreementViewContainerRoutingModule } from "./agreement-view-container-routing.module";
import { AgrMainInfoComponent } from "../agr-main-info/agr-main-info.component";


@NgModule({
  imports: [
    AgreementViewContainerRoutingModule,
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
  ],
  declarations: [
    ///customer
   AgreementViewContainerComponent,
   AgrMainInfoComponent


  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent,
    UcgridviewComponent,
    UcapprovalhistComponent
  ]

})
export class AgreementViewContainerModule { }