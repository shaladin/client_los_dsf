import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { VerfQuestionComponent } from "./verf-question/verf-question.component";
import { ViewAppCustDataPersonalComponent } from "./view-app-cust-data-personal/view-app-cust-data-personal.component";
import { ViewAppCustDataCompanyComponent } from "./view-app-cust-data-company/view-app-cust-data-company.component";

@NgModule({
    exports: [
        VerfQuestionComponent,
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataCompanyComponent,
    ],
    imports: [
        CommonModule,
        AdInsModule
    ],
    declarations: [
        VerfQuestionComponent,
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataCompanyComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class ProcessComponentModule { }