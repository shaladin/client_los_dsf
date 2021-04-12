import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { CustMainDataComponent } from "./cust-main-data/cust-main-data.component";
import { FamilyMainDataPagingComponent } from "./family-main-data/family-main-data-paging.component";
import { GuarantorMainDataPagingComponent } from "./guarantor-main-data/guarantor-main-data-paging.component";
import { MngmntShrhldrMainDataPagingComponent } from "./mngmnt-shrhldr-main-data/mngmnt-shrhldr-main-data-paging.component";
import { NgxCurrencyModule } from "ngx-currency";

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
    exports: [
        CustMainDataComponent,
        GuarantorMainDataPagingComponent,
        FamilyMainDataPagingComponent,
        MngmntShrhldrMainDataPagingComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        MatRadioModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    declarations: [
        CustMainDataComponent,
        GuarantorMainDataPagingComponent,
        FamilyMainDataPagingComponent,
        MngmntShrhldrMainDataPagingComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class MainDataComponentModule { }