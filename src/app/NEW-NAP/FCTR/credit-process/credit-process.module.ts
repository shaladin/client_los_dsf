import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { CreditProcessFCTRRoutingModule } from "./credit-process-routing.module";
import { CreditProcessComponentModule } from "app/NEW-NAP/sharing-component/credit-process-component/credit-process-component.module";

@NgModule({
  imports: [
    CommonModule,
    CreditProcessFCTRRoutingModule,
    AdInsModule,
    CreditProcessComponentModule
  ],
  declarations: [
    DummyComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessFCTRModule { }