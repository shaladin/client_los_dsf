import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapFL4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { FinancialDataComponent } from './financial-data/financial-data.component';
import { SubsidyComponent } from './financial-data/subsidy/subsidy.component'; 
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms"; 
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { UcinputnumberModule } from "@adins/ucinputnumber";

@NgModule({
  imports: [
    CommonModule,
    InputNapFL4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    UcShowErrorsModule,
    NgbModule, 
    ReactiveFormsModule,
    FormsModule,
    SharingComponentModule,
    UcinputnumberModule
  ],
  declarations: [
    DummyComponent,
    FinancialDataComponent,
    SubsidyComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    SubsidyComponent,
  ],
})
export class InputNapFL4WModule { }