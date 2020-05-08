import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ViewAgrmntReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { AgrmntLifeInsuranceComponent } from "./life-insurance/life-insurance.component";
import { AgrmntFinancialComponent } from './agrmnt-financial/agrmnt-financial.component';


@NgModule({
  exports: [
    ViewAgrmntReservedFundComponent,
    AgrmntLifeInsuranceComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,

  ],
  declarations: [
    ViewAgrmntReservedFundComponent,
    AgrmntLifeInsuranceComponent,
    AgrmntFinancialComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAgrmntComponentModule { }
