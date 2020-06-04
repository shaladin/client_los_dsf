import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapFL4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms"; 
import { UcShowErrorsModule } from "@adins/uc-show-errors"; 
import { UcinputnumberModule } from "@adins/ucinputnumber"; 
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapViewComponent } from './nap-view/nap-view.component';   
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { NgxCurrencyModule } from "ngx-currency";
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapTabComponentModule } from "./nap-tab/nap-tab.module";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { ViewAppComponentModule } from "../sharing-component/view-app-component/view-app-component.module";
import { AppMainInfoComponent } from "../sharing-component/view-main-info-component/app-main-info/app-main-info.component";
import { ViewSharingComponentModule } from "../sharing-component/view-app-component/view-sharing-component.module";
import { ViewAgrmntComponent } from './view-agrmnt/view-agrmnt.component';
import { TabCommissionComponent } from "../sharing-component/view-app-component/tab-commission/tab-commission.component";
import { AgrmntLifeInsuranceComponent } from "../sharing-component/view-agrmnt-component/life-insurance/life-insurance.component";
import { ViewCommissionComponent } from "../sharing-component/view-agrmnt-component/view-commission/view-commission.component";
import { ListDataCommissionComponent } from "../sharing-component/view-app-component/tab-commission/list-data-commission/list-data-commission.component";
import { ViewPurchaseOrderComponent } from "../sharing-component/view-agrmnt-component/view-purchase-order/view-purchase-order.component";
import { ViewDeliveryOrderComponent } from "../sharing-component/view-agrmnt-component/view-delivery-order/view-delivery-order.component";
import { AgrmntFinancialComponent } from "../sharing-component/view-agrmnt-component/agrmnt-financial/agrmnt-financial.component";
import { ViewAgrmntReservedFundComponent } from "../sharing-component/view-agrmnt-component/view-reserved-fund/view-reserved-fund.component";
import { ViewAgrmntSummaryComponent } from "../sharing-component/view-agrmnt-component/view-summary/view-summary.component";
import { ViewAgrmntDocumentComponent } from "../sharing-component/view-agrmnt-component/view-document/view-document.component";
import { AppTcComponent } from "../sharing-component/view-app-component/app-tc/app-tc.component";
import { AppAssetDataComponent } from "../sharing-component/view-app-component/app-asset-data/app-asset-data.component";
import { AppInsuranceComponent } from "../sharing-component/view-app-component/app-insurance/app-insurance.component";
import { FeeFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/fee/fee-FL4W.component";
import { SchmBalloonFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-baloon/schm-balloon-FL4W.component";
import { SchmEvenPrincipalFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-even-principal/schm-even-principal-FL4W.component";
import { SchmIrregularFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-irregular/schm-irregular-FL4W.component";
import { SchmRegulerFixFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-reguler-fix/schm-reguler-fix-FL4W.component";
import { SchmStepUpStepDownCummulativeFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative-FL4W.component";
import { SchmStepUpStepDownLeasingFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing-FL4W.component";
import { SchmStepUpStepDownNormalFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal-FL4W.component";
import { SubsidyFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/subsidy/subsidy-FL4W.component";
import { SubsidyAddEditFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/subsidy-add-edit/subsidy-add-edit-FL4W.component";
import { FinancialDataFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/financial-data-FL4W.component";
import { MultiCollDataComponent } from "../sharing-component/input-nap-component/collateral-data/multi-coll-data/multi-coll-data.component";
 
export const customCurrencyMaskConfig = {     
  align: "right",     
  allowNegative: true,     
  allowZero: true,     
  decimal: ".",     
  precision: 2,     
  prefix: "",     
  suffix: "",     
  thousands: ",",     
  nullable: false
};
 

@NgModule({
  imports: [
    CommonModule,
    InputNapFL4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    UcShowErrorsModule,
    NgbModule, 
    ReactiveFormsModule,
    FormsModule, 
    UcinputnumberModule, 
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NapTabComponentModule,
    ViewSharingComponentModule,
    MatTabsModule,
    ViewSharingComponentModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    DummyComponent, 
    NapAddComponent,
    NapPagingComponent,
    NapViewComponent,  
    NapAddDetailComponent, 
    ViewAgrmntComponent, 
    TabCommissionComponent,
    ListDataCommissionComponent,
    ViewAgrmntComponent,  
    AgrmntLifeInsuranceComponent,
    ViewCommissionComponent,
    ListDataCommissionComponent,
    ViewPurchaseOrderComponent,
    ViewDeliveryOrderComponent,
    AgrmntFinancialComponent,
    ViewAgrmntReservedFundComponent,
    ViewAgrmntSummaryComponent,
    ViewAgrmntDocumentComponent,
    AppTcComponent,
    AppAssetDataComponent,
    AppInsuranceComponent, 
    FeeFL4WComponent,
    SchmBalloonFL4WComponent,
    SchmEvenPrincipalFL4WComponent,
    SchmIrregularFL4WComponent,
    SchmRegulerFixFL4WComponent,
    SchmStepUpStepDownCummulativeFL4WComponent,
    SchmStepUpStepDownLeasingFL4WComponent,
    SchmStepUpStepDownNormalFL4WComponent,
    SubsidyFL4WComponent,
    SubsidyAddEditFL4WComponent,
    FinancialDataFL4WComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    SubsidyAddEditFL4WComponent
  ]
})
export class InputNapFL4WModule { }