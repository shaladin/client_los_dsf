import { NgModule } from "@angular/core";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatTabsModule } from "@angular/material";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { TrialCalculationRoutingModule } from "./trial-calculation-routing.module";
import { TrialCalculationComponent } from "./trial-calculation.component";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { InputNapFL4WModule } from "app/NEW-NAP/FL4W/input-nap.module";
import { InputNapCFNAModule } from "app/NEW-NAP/CFNA/input-nap.module";
import { InputNapFCTRModule } from "app/NEW-NAP/FCTR/input-nap.module";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  allowZero: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    NgbModule,
    RouterModule,
    AdInsModule,
    AdInsSharedModule,
    TrialCalculationRoutingModule,
    SharingModule,
    ArchwizardModule,
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ReactiveFormsModule,
    SharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    InputNapComponentModule,
    // InputNapFL4WModule,
    // InputNapCFNAModule,
    // InputNapFCTRModule
  ],
  declarations: [
    TrialCalculationComponent
  ],
  exports: [],
  providers: [NGXToastrService],
  entryComponents: [
  ]
})

export class TrialCalculationModule { }