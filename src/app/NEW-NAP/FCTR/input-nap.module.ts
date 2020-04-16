import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapFCTRRoutingModule } from "./input-nap-routing.module";
import { NapPagingComponent } from "./nap-paging/nap-paging.component";
import { NapAddComponent } from "./nap-add/nap-add.component";
import { NapAddDetailComponent } from "./nap-add-detail/nap-add-detail.component";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";

@NgModule({
  imports: [
    CommonModule,
    InputNapFCTRRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule
  ],
  declarations: [
    NapPagingComponent,
    NapAddComponent,
    NapAddDetailComponent,
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapFCTRModule { }