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
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

@NgModule({
  exports: [
    AgrMainInfoComponent,
    AppMainInfoComponent,
    DocSignerMainInfoComponent
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
    DocSignerMainInfoComponent
  ],

  providers: [
    NGXToastrService
  ]
})
export class ViewMainInfoComponentModule { }