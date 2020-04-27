import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapRFN4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NapPagingComponent } from "./nap-paging/nap-paging.component";

@NgModule({
  imports: [
    CommonModule,
    InputNapRFN4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule
  ],
  declarations: [
    NapPagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapRFN4WModule { }