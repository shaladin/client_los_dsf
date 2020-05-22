import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ViewAgrmntReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";
import { AgrmntLifeInsuranceComponent } from "./life-insurance/life-insurance.component";
import { ViewPurchaseOrderComponent } from './view-purchase-order/view-purchase-order.component';
import { ViewAgrmntDocumentComponent } from "./view-document/view-document.component";
import { ViewDeliveryOrderComponent } from "./view-delivery-order/view-delivery-order.component";
import { AgrmntFinancialComponent } from './agrmnt-financial/agrmnt-financial.component';
 
import { ViewAgrmntSummaryComponent } from "./view-summary/view-summary.component";
import { ViewCommissionComponent } from './view-commission/view-commission.component';
// import { AgrmntCardComponent } from './agrmnt-card/agrmnt-card.component';
// import { ListDataCommissionAgrmntComponent } from "./view-commission/list-data-commission/list-data-commission.component";


@NgModule({
  exports: [
    ViewAgrmntReservedFundComponent,
    AgrmntLifeInsuranceComponent,
    ViewAgrmntDocumentComponent,
    ViewDeliveryOrderComponent,  
    ViewPurchaseOrderComponent,
    ViewAgrmntSummaryComponent,
    ViewCommissionComponent,
    // ListDataCommissionAgrmntComponent,
    // AgrmntCardComponent
  ],
  imports: [
    CommonModule,
    AdInsModule,

  ],
  declarations: [
    ViewAgrmntReservedFundComponent,
    AgrmntLifeInsuranceComponent,
    ViewPurchaseOrderComponent,
    ViewAgrmntDocumentComponent,
    ViewDeliveryOrderComponent, 
    AgrmntFinancialComponent,
    ViewAgrmntSummaryComponent,
    ViewCommissionComponent, 
    // ListDataCommissionAgrmntComponent,
    // AgrmntCardComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAgrmntComponentModule { }
