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
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { CustomerViewTrustingSocialXRoutingModule } from "./customer-view-trusting-social-x-routing.module";
import { CustomerViewTrustingSocialXComponent } from "./customer-view-trusting-social-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";



@NgModule({
  exports: [
    CustomerViewTrustingSocialXComponent
  ],
  imports: [
    CustomerViewTrustingSocialXRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    UcviewgenericModule,
    UcgridviewModule,
    NgbModule,
    AdInsSharedModule,
    SharingModule,
    ArchwizardModule,
    ReactiveFormsModule,
    UcSubsectionModule,
    SharingComponentModule,
    UcShowErrorsModule,
  ],
  declarations: [
   CustomerViewTrustingSocialXComponent
  ],
  entryComponents: [
    UcviewgenericComponent,
    UcgridviewComponent
  ]

})
export class CustomerViewTrustingSocialXModule { }