import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { VerfQuestionComponent } from "./verf-question/verf-question.component";
import { CustHistoryComponent } from "./cust-history/cust-history.component";
import { AgrmntTcComponent } from "./agrmnt-tc/agrmnt-tc.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { AgrmntTcDsfComponent } from "app/dsf/impl/NEW-NAP/sharing-component/process-component/agrmnt-tc-dsf/agrmnt-tc-dsf.component";

@NgModule({
    exports: [
        VerfQuestionComponent,
        CustHistoryComponent,
        AgrmntTcComponent,
        AgrmntTcDsfComponent
    ],
    imports: [
        CommonModule,
        AdInsSharedModule,
        AdInsModule
    ],
    declarations: [
        VerfQuestionComponent,
        CustHistoryComponent,
        AgrmntTcComponent,
        AgrmntTcDsfComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ProcessComponentModule { }