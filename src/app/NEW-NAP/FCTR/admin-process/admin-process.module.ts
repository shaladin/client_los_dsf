import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdminProcessFCTRRoutingModule } from "./admin-process-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AdminProcessFCTRRoutingModule,
    AdInsModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdminProcessFCTRModule { }