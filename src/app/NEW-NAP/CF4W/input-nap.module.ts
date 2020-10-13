import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapCF4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NapAddComponent } from "./nap-add/nap-add.component";
import { NapPagingComponent } from "./nap-paging/nap-paging.component";
import { NapAddDetailComponent } from "./nap-add-detail/nap-add-detail.component";
import { NapDetailFormComponent } from "./nap-detail-form/nap-detail-form.component";

@NgModule({
  imports: [
    CommonModule,
    InputNapCF4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
  ],
  declarations: [
    NapAddComponent,
    NapPagingComponent,
    NapAddDetailComponent,
    NapDetailFormComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapCF4WModule { }