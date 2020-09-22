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
import { ViewDeviationComponent } from './view-deviation/view-deviation.component';
import { ViewCollateralComponent } from './view-collateral/view-collateral.component';
import { ViewAgrmntInsuranceComponent } from './view-insurance/view-insurance.component';
import { ViewInsuranceDetailComponent } from './view-insurance-detail/view-insurance-detail.component';
import { ViewAppCollateralSingleComponent } from './view-app-collateral-single/view-app-collateral-single.component';
import { ViewAppCollateralMultiComponent } from './view-app-collateral-multi/view-app-collateral-multi.component';
// import { AgrmntCardComponent } from './agrmnt-card/agrmnt-card.component';
import { ListDataCommissionAgrmntComponent } from "./view-commission/list-data-commission/list-data-commission.component";


@NgModule({
  exports: [
    ViewAgrmntReservedFundComponent,
    AgrmntLifeInsuranceComponent,
    ViewAgrmntDocumentComponent,
    ViewDeliveryOrderComponent,  
    ViewPurchaseOrderComponent,
    ViewAgrmntSummaryComponent,
    ViewCommissionComponent,
    ViewDeviationComponent,
    ViewCollateralComponent,
    AgrmntFinancialComponent,
    ViewAgrmntInsuranceComponent,
    ViewInsuranceDetailComponent,
    ViewAppCollateralSingleComponent,
    ViewAppCollateralMultiComponent,
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
    ViewDeviationComponent,
    ViewCollateralComponent,
    ViewAgrmntInsuranceComponent,
    ViewInsuranceDetailComponent,
    ViewAppCollateralSingleComponent,
    ViewAppCollateralMultiComponent,
    ListDataCommissionAgrmntComponent,
    // AgrmntCardComponent
  ],
  providers: [
    NGXToastrService
  ]
})
export class ViewAgrmntComponentModule { }
