import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapCFNARoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";

@NgModule({
  imports: [
    CommonModule,
    InputNapCFNARoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
  ],
  declarations: [
    // NapAddComponent,
    // NapPagingComponent,
    // NapAddDetailComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapCFNAModule { }