import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MainDataComponent } from "./main-data.component";
import { MainDataRoutingModule } from "./main-data-routing.module";
import { CustMainDataComponent } from "../sharing-component/main-data-component/cust-main-data/cust-main-data.component";
import { GuarantorMainDataPagingComponent } from "../sharing-component/main-data-component/guarantor-main-data/guarantor-main-data-paging.component";


@NgModule({
    declarations: [
        MainDataComponent,
        CustMainDataComponent,
        GuarantorMainDataPagingComponent,
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        AdInsModule,
        UcSubsectionModule,
        MainDataRoutingModule
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class MainDataModule { }