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
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapViewComponent } from './nap-view/nap-view.component';   
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapTabComponentModule } from "./nap-tab/nap-tab.module";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { ViewAppComponentModule } from "../sharing-component/view-app-component/view-app-component.module";
import { ViewSharingComponentModule } from "../sharing-component/view-app-component/view-sharing-component.module";
import { ViewAgrmntComponent } from './view-agrmnt/view-agrmnt.component';
// import { FeeFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/fee/fee-FL4W.component";
// import { SchmBalloonFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-baloon/schm-balloon-FL4W.component";
// import { SchmEvenPrincipalFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-even-principal/schm-even-principal-FL4W.component";
// import { SchmIrregularFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-irregular/schm-irregular-FL4W.component";
// import { SchmRegulerFixFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-reguler-fix/schm-reguler-fix-FL4W.component";
// import { SchmStepUpStepDownCummulativeFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative-FL4W.component";
// import { SchmStepUpStepDownLeasingFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing-FL4W.component";
// import { SchmStepUpStepDownNormalFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal-FL4W.component";
import { SubsidyFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/subsidy/subsidy-FL4W.component";
import { SubsidyAddEditFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/component/subsidy-add-edit/subsidy-add-edit-FL4W.component";
import { FinancialDataFL4WComponent } from "./input-nap-FL4W/financial-data-FL4W/financial-data-FL4W.component";
import { ViewDeliveryOrderMultiAssetComponent } from './view-agrmnt/view-delivery-order-multi-asset/view-delivery-order-multi-asset.component';
import { ViewDeliveryOrderDetailComponent } from './view-agrmnt/view-delivery-order-multi-asset/view-delivery-order-detail/view-delivery-order-detail.component';
import { ViewDeliveryOrderAssetDetailComponent } from './view-agrmnt/view-delivery-order-multi-asset/view-delivery-order-asset-detail/view-delivery-order-asset-detail.component';
import { MultiCollDataComponent } from "../sharing-component/input-nap-component/collateral-data/multi-coll-data/multi-coll-data.component"; 
import { ViewPurchaseOrderMultiAssetComponent } from './view-agrmnt/view-purchase-order-multi-asset/view-purchase-order-multi-asset.component';
import { ViewPurchaseOrderMultiAssetDetailComponent } from './view-agrmnt/view-purchase-order-multi-asset/view-purchase-order-multi-asset-detail/view-purchase-order-multi-asset-detail.component';
import { ViewAgrmntFl4wComponent } from './view-agrmnt-fl4w/view-agrmnt-fl4w.component';
import { AppInsuranceFl4wComponent } from './view-agrmnt-fl4w/app-insurance-fl4w/app-insurance-fl4w.component';
import { AppAssetDataFl4wComponent } from './view-agrmnt-fl4w/app-asset-data-fl4w/app-asset-data-fl4w.component';
import { ViewSummaryFl4wComponent } from './view-agrmnt-fl4w/view-summary-fl4w/view-summary-fl4w.component';
import { AppAssetDataDetailFl4wComponent } from './view-agrmnt-fl4w/app-asset-data-fl4w/app-asset-data-detail-fl4w/app-asset-data-detail-fl4w.component'; 
import { UcviewgenericComponent } from "@adins/ucviewgeneric";
import { ViewAgrmntComponentModule } from "../sharing-component/view-agrmnt-component/view-agrmnt-component.module";
import { NapCustMainDataComponent } from "./nap-cust-main-data/nap-cust-main-data.component";
import { NapDetailFormComponent } from "./nap-detail-form/nap-detail-form.component";
import { MainDataComponentModule } from "../sharing-component/main-data-component/main-data-component.module";
import { NewNapCustModule } from "../sharing-component/new-nap-cust-component/new-nap-cust.module";
import { SharedModule } from "app/shared/shared.module";

 
export const customCurrencyMaskConfig = {     
  align: "right",     
  allowNegative: true,     
  allowZero: true,     
  decimal: ".",     
  precision: 2,     
  prefix: "",     
  suffix: "",     
  thousands: ",",     
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
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
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NapTabComponentModule,
    ViewSharingComponentModule,
    MatTabsModule,
    ViewAppComponentModule,
    ViewAgrmntComponentModule,
    ViewSharingComponentModule,
    ViewMainInfoComponentModule,
    MainDataComponentModule,
    NewNapCustModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    SharedModule
  ],
  declarations: [
    DummyComponent, 
    NapAddComponent,
    NapPagingComponent,
    NapViewComponent,  
    NapAddDetailComponent, 
    ViewAgrmntComponent,  
    // FeeFL4WComponent,
    // SchmBalloonFL4WComponent,
    // SchmEvenPrincipalFL4WComponent,
    // SchmIrregularFL4WComponent,
    // SchmRegulerFixFL4WComponent,
    // SchmStepUpStepDownCummulativeFL4WComponent,
    // SchmStepUpStepDownLeasingFL4WComponent,
    // SchmStepUpStepDownNormalFL4WComponent,
    SubsidyFL4WComponent,
    SubsidyAddEditFL4WComponent,
    FinancialDataFL4WComponent,
    ViewDeliveryOrderMultiAssetComponent,
    ViewDeliveryOrderDetailComponent,
    ViewDeliveryOrderAssetDetailComponent,
    ViewPurchaseOrderMultiAssetComponent, 
    ViewPurchaseOrderMultiAssetDetailComponent, ViewAgrmntFl4wComponent, AppInsuranceFl4wComponent, AppAssetDataFl4wComponent, ViewSummaryFl4wComponent, AppAssetDataDetailFl4wComponent,
    NapCustMainDataComponent,
    NapDetailFormComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    SubsidyAddEditFL4WComponent,
    AppAssetDataDetailFl4wComponent,
    UcviewgenericComponent
  ]
})
export class InputNapFL4WModule { }