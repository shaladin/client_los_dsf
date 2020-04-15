import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TermConditionsComponent } from "./term-conditions/term-conditions.component";

@NgModule({
    exports: [
        TermConditionsComponent
    ],
    imports: [
        CommonModule,
        AdInsModule
    ],
    declarations: [
        TermConditionsComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class TcSharingComponentModule { }