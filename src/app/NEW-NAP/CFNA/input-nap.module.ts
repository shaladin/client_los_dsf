import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapCFNARoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { FinancialDataCFNAComponent } from "./nap-components/financial-data/financial-data-cfna.component";
import { FeeCFNAComponent } from "./nap-components/financial-data/component/fee/fee-cfna.component";
import { SubsidyCFNAComponent } from "./nap-components/financial-data/component/subsidy/subsidy-cfna.component";
import { SubsidyAddEditCFNAComponent } from "./nap-components/financial-data/component/subsidy-add-edit/subsidy-add-edit-cfna.component";
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { UcviewgenericComponent } from "@adins/ucviewgeneric";
import { NapDetailFormComponent } from "./nap-detail-form/nap-detail-form.component";
import { NapCustMainDataComponent } from "./nap-cust-main-data/nap-cust-main-data.component";
import { MainDataComponentModule } from "../sharing-component/main-data-component/main-data-component.module";
import { NewNapCustModule } from "../sharing-component/new-nap-cust-component/new-nap-cust.module";
import { SharedModule } from "app/shared/shared.module";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { AdInsSharedModule } from "app/components/adins-module/AdInsShared.Module";

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
    InputNapCFNARoutingModule,
    AdInsModule,
    AdInsSharedModule,
    InputNapComponentModule,
    ArchwizardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    MainDataComponentModule,
    NewNapCustModule,
    SharedModule,
    ViewMainInfoComponentModule
  ],
  declarations: [
    NapAddDetailComponent,
    NapPagingComponent,
    NapAddComponent,
    FinancialDataCFNAComponent,
    SubsidyCFNAComponent,
    SubsidyAddEditCFNAComponent,
    NapCustMainDataComponent,
    NapDetailFormComponent
  ],
  providers: [
    NGXToastrService
  ],
  entryComponents: [
    SubsidyAddEditCFNAComponent,
    UcviewgenericComponent
  ]
})
export class InputNapCFNAModule { }