import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TermConditionsComponent } from "./term-conditions/term-conditions.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

@NgModule({
    exports: [
        TermConditionsComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule
    ],
    declarations: [
        TermConditionsComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class TcSharingComponentModule { }