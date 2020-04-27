import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { LifeInsuranceComponent } from './life-insurance/life-insurance.component';
import { AppTcComponent } from './app-tc/app-tc.component';

@NgModule({
  exports: [
    ViewReservedFundComponent
  ],
  imports: [
    CommonModule,
    AdInsModule
  ],
  declarations: [
    InvoiceDataFctrComponent,
    ViewReservedFundComponent,
    LifeInsuranceComponent,
    AppTcComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAppComponentModule { }
