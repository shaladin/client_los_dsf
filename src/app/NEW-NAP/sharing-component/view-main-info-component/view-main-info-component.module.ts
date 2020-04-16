import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { FraudVerificationComponent } from './fraud-verification/fraud-verification.component';
import { FinancialDataComponent } from './financial-data/financial-data.component';
import { SubsidyComponent } from './financial-data/subsidy/subsidy.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AgrMainInfoComponent } from "./agr-main-info/agr-main-info.component";
import { AppMainInfoComponent } from "./app-main-info/app-main-info.component";
import { DummyComponent } from "app/NEW-NAP/CF4W/additional-process/dummy/dummy.component";

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
    UcinputnumberModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    DummyComponent,
    FraudVerificationComponent,
    FinancialDataComponent,
    SubsidyComponent,
    
      AgrMainInfoComponent,
      AppMainInfoComponent,
  ],
 
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    SubsidyComponent
  ]
})
export class ViewMainInfoComponentModule { }