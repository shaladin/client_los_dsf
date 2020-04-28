import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';
import { TabReferantorComponent } from './tab-referantor/tab-referantor.component';
import { TabCommissionComponent } from './tab-commission/tab-commission.component';
import { ListDataCommissionComponent } from './tab-commission/list-data-commission/list-data-commission.component';
import { TabApplicationComponent } from './tab-application/tab-application.component';
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { LifeInsuranceComponent } from './life-insurance/life-insurance.component';
import { AppTcComponent } from './app-tc/app-tc.component';
import { TabAnalysisResultComponent } from './tab-analysis-result/tab-analysis-result.component';

@NgModule({
  exports: [
    ViewReservedFundComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,
  ],
  declarations: [
    InvoiceDataFctrComponent,
    TabReferantorComponent,
    TabCommissionComponent,
    ListDataCommissionComponent,
    TabApplicationComponent,
    ViewReservedFundComponent,
    LifeInsuranceComponent,
    AppTcComponent,
    TabAnalysisResultComponent,
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAppComponentModule { }
