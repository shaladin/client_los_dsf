import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgrMainInfoComponent } from "./agr-main-info/agr-main-info.component";
import { AppMainInfoComponent } from "./app-main-info/app-main-info.component";
import { DocSignerMainInfoComponent } from './doc-signer-main-info/doc-signer-main-info.component';
import { AppMainInfoComponentXComponent } from "app/impl/NEW-NAP/sharing-component/view-main-info-component/app-main-info-component-x/app-main-info-component-x.component";
import { DocSignerMainInfoXComponent } from "app/impl/NEW-NAP/sharing-component/view-main-info-component/doc-signer-main-info/doc-signer-main-info-x.component";
import { AppMainInfoXComponent } from "app/impl/NEW-NAP/sharing-component/view-main-info-component/app-main-info/app-main-info-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { AppMainInfoCrXComponent } from "app/impl/NEW-NAP/sharing-component/view-main-info-component/app-main-info-cr-x/app-main-info-cr-x.component";

@NgModule({
  exports: [
    AgrMainInfoComponent,
    AppMainInfoComponent,
    AppMainInfoXComponent,
    DocSignerMainInfoComponent,
    DocSignerMainInfoXComponent,
    AppMainInfoComponentXComponent,
    AppMainInfoCrXComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
    AdInsSharedModule,
    ReactiveFormsModule,
    UcShowErrorsModule,
    SharingComponentModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AgrMainInfoComponent,
    AppMainInfoComponent,
    AppMainInfoXComponent,
    DocSignerMainInfoComponent,
    DocSignerMainInfoXComponent,
    AppMainInfoComponentXComponent,
    AppMainInfoCrXComponent
  ],

  providers: [
    NGXToastrService
  ]
})
export class ViewMainInfoComponentModule { }
