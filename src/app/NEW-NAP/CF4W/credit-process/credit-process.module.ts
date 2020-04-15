import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { CreditProcessCF4WRoutingModule } from "./credit-process-routing.module";
import { CreditProcessComponentModule } from "app/NEW-NAP/sharing-component/credit-process-component/credit-process-component.module";

@NgModule({
  imports: [
    CommonModule,
    CreditProcessCF4WRoutingModule,
    AdInsModule
  ],
  declarations: [
    DummyComponent,
    CreditProcessComponentModule
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessCF4WModule { }