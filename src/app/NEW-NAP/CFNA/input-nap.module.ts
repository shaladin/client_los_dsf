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
import { SchmBalloonCFNAComponent } from "./nap-components/financial-data/component/schm-baloon/schm-balloon-cfna.component";
import { SchmEvenPrincipalCFNAComponent } from "./nap-components/financial-data/component/schm-even-principal/schm-even-principal-cfna.component";
import { SchmIrregularCFNAComponent } from "./nap-components/financial-data/component/schm-irregular/schm-irregular-cfna.component";
import { SchmRegulerFixCFNAComponent } from "./nap-components/financial-data/component/schm-reguler-fix/schm-reguler-fix-cfna.component";
import { SchmStepUpStepDownCummulativeCFNAComponent } from "./nap-components/financial-data/component/schm-step-up-step-down-cummulative/schm-step-up-step-down-cummulative-cfna.component";
import { SchmStepUpStepDownLeasingCFNAComponent } from "./nap-components/financial-data/component/schm-step-up-step-down-leasing/schm-step-up-step-down-leasing-cfna.component";
import { SchmStepUpStepDownNormalCFNAComponent } from "./nap-components/financial-data/component/schm-step-up-step-down-normal/schm-step-up-step-down-normal-cfna.component";
import { SubsidyCFNAComponent } from "./nap-components/financial-data/component/subsidy/subsidy-cfna.component";
import { SubsidyAddEditCFNAComponent } from "./nap-components/financial-data/component/subsidy-add-edit/subsidy-add-edit-cfna.component";
import { MatCheckboxModule, MatRadioModule, MatSelectModule, MatTabsModule } from "@angular/material";
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { UcviewgenericComponent } from "@adins/ucviewgeneric";

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
    InputNapComponentModule,
    ArchwizardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    NapAddDetailComponent,
    NapPagingComponent,
    NapAddComponent,
    FinancialDataCFNAComponent,
    FeeCFNAComponent,
    SchmBalloonCFNAComponent,
    SchmEvenPrincipalCFNAComponent,
    SchmIrregularCFNAComponent,
    SchmRegulerFixCFNAComponent,
    SchmStepUpStepDownCummulativeCFNAComponent,
    SchmStepUpStepDownLeasingCFNAComponent,
    SchmStepUpStepDownNormalCFNAComponent,
    SubsidyCFNAComponent,
    SubsidyAddEditCFNAComponent
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