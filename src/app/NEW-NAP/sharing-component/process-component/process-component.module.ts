import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { VerfQuestionComponent } from "./verf-question/verf-question.component";
import { CustHistoryComponent } from "./cust-history/cust-history.component";
import { AgrmntTcComponent } from "./agrmnt-tc/agrmnt-tc.component";

@NgModule({
    exports: [
        VerfQuestionComponent,
        CustHistoryComponent,
        AgrmntTcComponent
    ],
    imports: [
        CommonModule,
        AdInsModule
    ],
    declarations: [
        VerfQuestionComponent,
        CustHistoryComponent,
        AgrmntTcComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ProcessComponentModule { }