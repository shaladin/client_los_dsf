import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessCF4WRoutingModule } from "./admin-process-routing.module";
import { AdminProcessComponentModule } from "app/NEW-NAP/sharing-component/admin-process-component/admin-process-component.module";

@NgModule({
  imports: [
    CommonModule,
    AdminProcessCF4WRoutingModule,
    AdInsModule,
    AdminProcessComponentModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessCF4WModule { }