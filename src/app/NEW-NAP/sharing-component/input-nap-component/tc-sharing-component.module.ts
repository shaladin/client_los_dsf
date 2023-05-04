import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TermConditionsComponent } from "./term-conditions/term-conditions.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { TermConditionsXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/term-conditions/term-conditions-x.component";

@NgModule({
    exports: [
        TermConditionsComponent,
        TermConditionsXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule
    ],
    declarations: [
        TermConditionsComponent,
        TermConditionsXComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class TcSharingComponentModule { }