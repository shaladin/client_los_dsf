import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TcSharingComponentModule } from "./tc-sharing-component.module";
import { GuarantorComponent } from "./guarantor/guarantor.component";

@NgModule({
  exports: [
    TcSharingComponentModule,
    GuarantorComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
    TcSharingComponentModule
  ],
  declarations: [
    GuarantorComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class InputNapComponentModule { }