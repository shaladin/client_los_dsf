import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ViewAgrmntReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";


@NgModule({
  exports: [
    ViewAgrmntReservedFundComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,

  ],
  declarations: [
    ViewAgrmntReservedFundComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAgrmntComponentModule { }
