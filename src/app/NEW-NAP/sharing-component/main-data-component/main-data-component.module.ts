import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { CustMainDataComponent } from "./cust-main-data/cust-main-data.component";
import { FamilyMainDataPagingComponent } from "./family-main-data/family-main-data-paging.component";
import { GuarantorMainDataPagingComponent } from "./guarantor-main-data/guarantor-main-data-paging.component";
import { TestMainDataComponent } from "./test-main-data/test-main-data.component";
import { MngmntShrhldrMainDataPagingComponent } from "./mngmnt-shrhldr-main-data/mngmnt-shrhldr-main-data-paging.component";

@NgModule({
    exports: [
        CustMainDataComponent,
        GuarantorMainDataPagingComponent,
        FamilyMainDataPagingComponent,
        TestMainDataComponent,
        MngmntShrhldrMainDataPagingComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        MatRadioModule
    ],
    declarations: [
        CustMainDataComponent,
        GuarantorMainDataPagingComponent,
        FamilyMainDataPagingComponent,
        TestMainDataComponent,
        MngmntShrhldrMainDataPagingComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class MainDataComponentModule { }