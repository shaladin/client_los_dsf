import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MainDataRoutingModule } from "./main-data-routing.module";
import { CustMainDataPagingComponent } from "./cust-main-data/cust-main-data-paging/cust-main-data-paging.component";
import { CustMainDataAddComponent } from "./cust-main-data/cust-main-data-add/cust-main-data-add.component";
import { NapDetailPagingComponent } from "./nap-detail/nap-detail-paging/nap-detail-paging.component";
import { CustMainDataPagingDsfComponent } from "../DSF/main-data-dsf/cust-main-data-dsf/cust-main-data-paging-dsf/cust-main-data-paging-dsf.component";
import { CustMainDataAddDsfComponent } from "../DSF/main-data-dsf/cust-main-data-dsf/cust-main-data-add-dsf/cust-main-data-add-dsf.component";
import { NapDetailPagingDsfComponent } from "../DSF/main-data-dsf/nap-detail-dsf/nap-detail-paging-dsf/nap-detail-paging-dsf.component";


@NgModule({
    declarations: [
        CustMainDataPagingComponent,
        CustMainDataAddComponent,
        NapDetailPagingComponent,
        CustMainDataPagingDsfComponent,
        CustMainDataAddDsfComponent,
        NapDetailPagingDsfComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        UcSubsectionModule,
        MainDataRoutingModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
    ]
})

export class MainDataModule { }