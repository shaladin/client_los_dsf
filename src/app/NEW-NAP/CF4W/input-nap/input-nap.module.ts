import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapCF4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";

@NgModule({
  imports: [
    CommonModule,
    InputNapCF4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapCF4WModule { }