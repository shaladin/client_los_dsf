import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { LifeInsuranceComponent } from './life-insurance/life-insurance.component';
import { AppTcComponent } from './app-tc/app-tc.component';
import { ViewInsuranceComponent } from "./view-insurance/view-insurance.component";
import { AppAssetDataComponent } from './app-asset-data/app-asset-data.component';
import { AppAssetDataDetailComponent } from './app-asset-data/app-asset-data-detail/app-asset-data-detail.component';
import { ViewFinancialComponent } from "./view-financial/view-financial.component";

@NgModule({
  exports: [
    ViewReservedFundComponent,
    ViewInsuranceComponent,
    ViewFinancialComponent,
  ],
  imports: [
    CommonModule,
    AdInsModule
  ],
  declarations: [
    InvoiceDataFctrComponent,
    ViewReservedFundComponent,
    LifeInsuranceComponent,
    AppTcComponent,
    ViewInsuranceComponent,
    AppAssetDataComponent,
    AppAssetDataDetailComponent,
    ViewFinancialComponent,
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAppComponentModule { }
