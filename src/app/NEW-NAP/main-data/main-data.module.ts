import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MainDataComponent } from "./main-data.component";
import { MainDataRoutingModule } from "./main-data-routing.module";
import { MainDataComponentModule } from "../sharing-component/main-data-component/main-data-component.module";
import { Nap1PagingComponent } from "./nap-1/nap-1-paging/nap-1-paging.component";
import { Nap1AddComponent } from "./nap-1/nap-1-add/nap-1-add.component";


@NgModule({
    declarations: [
        MainDataComponent,
        Nap1PagingComponent,
        Nap1AddComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        UcSubsectionModule,
        MainDataRoutingModule,
        MainDataComponentModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class MainDataModule { }