import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MainDataRoutingModule } from "./main-data-routing.module";
import { CustMainDataPagingComponent } from "./cust-main-data/cust-main-data-paging/cust-main-data-paging.component";
import { CustMainDataAddComponent } from "./cust-main-data/cust-main-data-add/cust-main-data-add.component";
import { NapDetailPagingComponent } from "./nap-detail/nap-detail-paging/nap-detail-paging.component";
import { CustMainDataPagingXComponent } from "app/impl/NEW-NAP/main-data/cust-main-data/cust-main-data-paging-x/cust-main-data-paging-x.component";
import { CustMainDataAddXComponent } from "app/impl/NEW-NAP/main-data/cust-main-data/cust-main-data-add-x/cust-main-data-add-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";


@NgModule({
    declarations: [
        CustMainDataPagingComponent,
        CustMainDataAddComponent,
        NapDetailPagingComponent,
        CustMainDataPagingXComponent,
        CustMainDataAddXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule,
        UcSubsectionModule,
        MainDataRoutingModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
    ]
})

export class MainDataModule { }