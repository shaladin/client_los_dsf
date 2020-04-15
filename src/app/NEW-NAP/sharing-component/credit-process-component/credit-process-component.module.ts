import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";

@NgModule({
  exports: [
      
  ],
  imports: [
    CommonModule,
    AdInsModule
  ],
  declarations: [
  ],
  providers: [
    NGXToastrService
  ]
})
export class CreditProcessComponentModule { }