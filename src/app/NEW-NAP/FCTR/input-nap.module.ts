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
import { MainDataComponentModule } from "../sharing-component/main-data-component/main-data-component.module";
import { NapCustMainDataComponent } from "./nap-cust-main-data/nap-cust-main-data.component";
import { NapDetailFormComponent } from "./nap-detail-form/nap-detail-form.component";

@NgModule({
  imports: [
    CommonModule,
    InputNapFCTRRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    MainDataComponentModule
  ],
  declarations: [
    NapPagingComponent,
    NapAddComponent,
    NapAddDetailComponent,
    NapCustMainDataComponent,
    NapDetailFormComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapFCTRModule { }