import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { InputNapCF2WRoutingModule } from "./input-nap-routing.module";
import { AppComponent } from './app/app.component';
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { AppAddFreeComponent } from "./app-add-free/app-add-free.component";
import { AppAddFixedComponent } from "./app-add-fixed/app-add-fixed.component";
import { AppAddDetailComponent } from "./app-add-detail/app-add-detail.component";
import { ViewMainInfoComponentModule } from "../sharing-component/view-main-info-component/view-main-info-component.module";
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
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
        CommonModule,
        InputNapCF2WRoutingModule,
        AdInsModule,
        AdInsSharedModule,
        InputNapComponentModule,
        ArchwizardModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        ViewMainInfoComponentModule
    ],
    declarations: [ 
        AppComponent,
        AppPagingComponent,
        AppAddFreeComponent,
        AppAddFixedComponent,
        AppAddDetailComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class InputNapCF2WModule { }