import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UclookupgenericModule, UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcviewgenericModule, UcviewgenericComponent } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
import { MatRadioModule, MatTabsModule } from "@angular/material";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { CustSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/cust-sharing-component.module";
import { UcuploadModule } from "@adins/ucupload";
import { UcaddtotempModule } from "@adins/ucaddtotemp";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { UcapprovalcreateModule } from "@adins/ucapprovalcreate";
import { UcapprovalR3Module } from "@adins/ucapproval-r3";
import { UcapprovalgeneralinfoModule } from "@adins/ucapprovalgeneralinfo";
import { UcgridviewModule } from "@adins/ucgridview";
import { CessieMonitoringComponent } from "./cessie/cessie-upload/cessie-monitoring.component";
import { ImplRoutingModule } from "./impl-routing.component";
export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  imports: [
    ImplRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    UCSearchModule,
    UcgridfooterModule,
    UcpagingModule,
    NgbModule,
    SharingModule,
    ReactiveFormsModule,
    UcaddressModule,
    UcSubsectionModule,
    UcShowErrorsModule,
    UclookupgenericModule,
    UcviewgenericModule,
    SharingComponentModule,
    ArchwizardModule,
    MatRadioModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CustSharingComponentModule,
    UcuploadModule,
    UcaddtotempModule,
    MatTabsModule,
    UcapprovalcreateModule,
    UcapprovalHistoryModule,
    UcapprovalR3Module,
    UcapprovalgeneralinfoModule,
    UcgridviewModule
  ],
  declarations: [
    CessieMonitoringComponent
  ],
  entryComponents: [
    UclookupgenericComponent,
    UcviewgenericComponent
  ]
})

export class ImplModule { }