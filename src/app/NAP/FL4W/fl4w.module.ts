import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { FL4WRoutingModule } from "./fl4w-routing.module";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { FraudVerificationComponent } from './fraud-verification/fraud-verification.component';
import { FinancialDataComponent } from './financial-data/financial-data.component';
import { SubsidyComponent } from './financial-data/subsidy/subsidy.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    FL4WRoutingModule,
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
    SubsidyComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    SubsidyComponent
  ]
})
export class FL4WModule { }