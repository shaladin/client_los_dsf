import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { VerfQuestionComponent } from "./verf-question/verf-question.component";
import { CustHistoryComponent } from "./cust-history/cust-history.component";

@NgModule({
    exports: [
        VerfQuestionComponent,
        CustHistoryComponent
    ],
    imports: [
        CommonModule,
        AdInsModule
    ],
    declarations: [
        VerfQuestionComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class ProcessComponentModule { }