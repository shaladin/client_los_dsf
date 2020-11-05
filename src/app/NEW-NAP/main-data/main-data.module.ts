import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MainDataRoutingModule } from "./main-data-routing.module";
import { CustMainDataPagingComponent } from "./cust-main-data/cust-main-data-paging/cust-main-data-paging.component";
import { CustMainDataAddComponent } from "./cust-main-data/cust-main-data-add/cust-main-data-add.component";
import { NapDetailPagingComponent } from "./nap-detail/nap-detail-paging/nap-detail-paging.component";


@NgModule({
    declarations: [
        CustMainDataPagingComponent,
        CustMainDataAddComponent,
        NapDetailPagingComponent
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