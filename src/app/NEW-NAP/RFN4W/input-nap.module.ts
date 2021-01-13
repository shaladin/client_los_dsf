import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapRFN4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NapPagingComponent } from "./nap-paging/nap-paging.component";
import { NapAddComponent } from "./nap-add/nap-add.component";
import { NapAddDetailComponent } from "./nap-add-detail/nap-add-detail.component";
import { NapCustMainDataComponent } from "./nap-cust-main-data/nap-cust-main-data.component";
import { MainDataComponentModule } from "../sharing-component/main-data-component/main-data-component.module";
import { NapDetailFormComponent } from "./nap-detail-form/nap-detail-form.component";
import { NewNapCustModule } from "../sharing-component/new-input-nap/new-nap-cust.module";

@NgModule({
  imports: [
    CommonModule,
    InputNapRFN4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    MainDataComponentModule,
    NewNapCustModule
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
export class InputNapRFN4WModule { }