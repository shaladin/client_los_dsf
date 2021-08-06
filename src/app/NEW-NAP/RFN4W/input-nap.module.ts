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
import { NewNapCustModule } from "../sharing-component/new-nap-cust-component/new-nap-cust.module";
import { SharedModule } from "app/shared/shared.module";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { NapCustMainDataDsfComponent } from "../DSF/RFN4W-dsf/nap-cust-main-data-dsf/nap-cust-main-data-dsf.component";
import { NapDetailFormDsfComponent } from "../DSF/RFN4W-dsf/nap-detail-form-dsf/nap-detail-form-dsf.component";

@NgModule({
  imports: [
    CommonModule,
    InputNapRFN4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    MainDataComponentModule,
    NewNapCustModule,
    SharedModule,
    ViewMainInfoComponentModule
  ],
  declarations: [
    NapPagingComponent,
    NapAddComponent,
    NapAddDetailComponent,
    NapCustMainDataComponent,
    NapDetailFormComponent,
    NapCustMainDataDsfComponent,
    NapDetailFormDsfComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapRFN4WModule { }