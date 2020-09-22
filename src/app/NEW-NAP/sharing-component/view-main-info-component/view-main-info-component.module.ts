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

@NgModule({
  exports: [
    AgrMainInfoComponent,
    AppMainInfoComponent,
  ],
  imports: [
    CommonModule,
    AdInsModule,
    ReactiveFormsModule,
    UcShowErrorsModule,
    SharingComponentModule,
    FormsModule,
    NgbModule
  ],
  declarations: [ 
    AgrMainInfoComponent,
    AppMainInfoComponent,
  ],

  providers: [
    NGXToastrService
  ]
})
export class ViewMainInfoComponentModule { }