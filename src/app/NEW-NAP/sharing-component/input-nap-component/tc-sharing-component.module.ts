import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TermConditionsComponent } from "./term-conditions/term-conditions.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { TermConditionsXComponent } from "app/impl/NEW-NAP/sharing-component/input-nap-component/term-conditions/term-conditions-x.component";
import { TermConditionsXDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/input-nap-component/term-conditions-x-dsf/term-conditions-x-dsf.component";

@NgModule({
    exports: [
        TermConditionsComponent,
        TermConditionsXComponent,
        TermConditionsXDsfComponent,
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule
    ],
    declarations: [
        TermConditionsComponent,
        TermConditionsXComponent,
        TermConditionsXDsfComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class TcSharingComponentModule { }