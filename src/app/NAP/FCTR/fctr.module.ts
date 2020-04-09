import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { FCTRRoutingModule } from "./fctr-routing.module";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";

@NgModule({
  imports: [
    CommonModule,
    FCTRRoutingModule,
    AdInsModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class FCTRModule { }