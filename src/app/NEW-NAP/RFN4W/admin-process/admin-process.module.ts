import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessRFN4WRoutingModule } from "./admin-process-routing.module";
import { PreGoLivePagingComponent } from "./pre-go-live/pre-go-live-paging/pre-go-live-paging.component";
import { AdminProcessComponentModule } from "app/NEW-NAP/sharing-component/admin-process-component/admin-process-component.module";

@NgModule({
  imports: [
    CommonModule,
    AdminProcessRFN4WRoutingModule,
    AdInsModule,
    AdminProcessComponentModule
  ],
  declarations: [
    PreGoLivePagingComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessRFN4WModule { }