import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { SharedModule } from "app/shared/shared.module";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { UcpagingComponent } from "@adins/ucpaging";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatRadioModule,
        NapRoutingModule,
        AdInsModule,
        AdInsSharedModule,
        UcSubsectionModule,
        ViewAppComponentModule,
        SharedModule
    ],
    exports: [],
    entryComponents: [
        UcpagingComponent
    ],
    providers: [
        NGXToastrService
      ]
})

export class NapModule { }