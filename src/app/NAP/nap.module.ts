import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchwizardModule } from "angular-archwizard";
import { UcpagingModule } from "@adins/ucpaging";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NapRoutingModule } from "./nap-routing.module";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatSelectModule } from "@angular/material";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcaddressModule } from "@adins/ucaddress";
import { UcgridviewModule } from "@adins/ucgridview";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UCSearchModule } from '@adins/ucsearch';
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxCurrencyModule } from 'ngx-currency';
import { VerfQuestionComponent } from "./nap-component/verf-question/verf-question.component";
export const customCurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ".",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ",",
    nullable: false
};



@NgModule({
    declarations: [
        VerfQuestionComponent,
        ],
    imports: [
        NapRoutingModule,
        CommonModule,
        ArchwizardModule,
        UcpagingModule,
        UcviewgenericModule,
        UclookupgenericModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        CommonModule,
        RouterModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        UcSubsectionModule,
        SharingComponentModule, 
        UcaddressModule,
        UcgridviewModule,
        UCSearchModule,
        UcShowErrorsModule,
        NgbModule,
        UcinputnumberModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    exports: [],
    entryComponents: [],
    providers: [NGXToastrService,NgbActiveModal],
})

export class NapModule { }
