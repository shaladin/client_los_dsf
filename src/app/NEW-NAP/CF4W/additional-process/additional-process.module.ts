import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AdditionalProcessCF4WRoutingModule } from "./additional-process-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AdditionalProcessCF4WRoutingModule,
    AdInsModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class AdditionalProcessCF4WModule { }