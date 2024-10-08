import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { CustMainDataComponent } from "./cust-main-data/cust-main-data.component";
import { FamilyMainDataPagingComponent } from "./family-main-data/family-main-data-paging.component";
import { GuarantorMainDataPagingComponent } from "./guarantor-main-data/guarantor-main-data-paging.component";
import { MngmntShrhldrMainDataPagingComponent } from "./mngmnt-shrhldr-main-data/mngmnt-shrhldr-main-data-paging.component";
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { CustPublicComponent } from "./components/cust-public/cust-public.component";
import { CustAttrFormComponent } from "./components/cust-attr-form/cust-attr-form.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CustMainDataXComponent } from "app/impl/NEW-NAP/sharing-component/main-data-component/cust-main-data/cust-main-data-x.component";
import { GuarantorMainDataPagingXComponent } from "app/impl/NEW-NAP/sharing-component/main-data-component/guarantor-main-data/guarantor-main-data-paging-x.component";
import { FamilyMainDataPagingXComponent } from "app/impl/NEW-NAP/sharing-component/main-data-component/family-main-data/family-main-data-paging-x.component";
import { MngmntShrhldrMainDataPagingXComponent } from "app/impl/NEW-NAP/sharing-component/main-data-component/mngmnt-shrhldr-main-data-paging-x/mngmnt-shrhldr-main-data-paging-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { CustPublicXComponent } from "app/impl/NEW-NAP/sharing-component/main-data-component/component/cust-public/cust-public-x.component";
import { CustMainDataXDsfComponent } from "app/NEW-NAP/DSF/sharing-component-dsf/main-data-component-dsf/cust-main-data-x-dsf/cust-main-data-x-dsf.component";

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
    exports: [
        CustMainDataComponent,
        CustPublicComponent,
        CustAttrFormComponent,
        GuarantorMainDataPagingComponent,
        FamilyMainDataPagingComponent,
        MngmntShrhldrMainDataPagingComponent,
        CustMainDataXComponent,
        GuarantorMainDataPagingXComponent,
        FamilyMainDataPagingXComponent,
        MngmntShrhldrMainDataPagingXComponent,
        CustPublicXComponent,
        CustMainDataXDsfComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule,
        MatRadioModule,
        NgMultiSelectDropDownModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    declarations: [
        CustMainDataComponent,
        CustPublicComponent,
        CustAttrFormComponent,
        GuarantorMainDataPagingComponent,
        FamilyMainDataPagingComponent,
        MngmntShrhldrMainDataPagingComponent,
        CustMainDataXComponent,
        GuarantorMainDataPagingXComponent,
        FamilyMainDataPagingXComponent,
        MngmntShrhldrMainDataPagingXComponent,
        CustPublicXComponent,
        CustMainDataXDsfComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class MainDataComponentModule { }
