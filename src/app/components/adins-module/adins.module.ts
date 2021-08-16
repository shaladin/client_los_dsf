
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcpagingModule } from '@adins/ucpaging';
import { UCSearchModule } from "@adins/ucsearch";
import { UcgridfooterModule } from '@adins/ucgridfooter';
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { UcapprovalModule } from '@adins/ucapproval';
import { UcgridviewModule } from '@adins/ucgridview';
import { UcapprovebyModule } from '@adins/ucapproveby';
import { UcaddressModule } from '@adins/ucaddress';
import { MatCheckboxModule } from '@angular/material';
import { UcuploadModule } from '@adins/ucupload';
import { UcapprovalhistModule } from '@adins/ucapprovalhist';
import { UcaddtotempModule } from '@adins/ucaddtotemp';
import { UcthingstodoModule } from '@adins/ucthingstodo';
import { UcdropdownlistModule } from '@adins/ucdropdownlist';
import { UcreportModule } from "@adins/ucreport";
import { UcTestingComponent } from './uc-testing/uc-testing.component';
import { UcTestComponent } from './uc-test/uc-test.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { UcDirectiveUpperCaseModule } from '@adins/uc-directive-upper-case';
import { RefAttrGenerateComponent } from './ref-attr-generate/ref-attr-generate.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

export const customCurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    allowZero: true,
    decimal: ".",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ",",
    nullable: false,
    inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
    declarations: [
        UcTestingComponent,
        UcTestComponent,
        RefAttrGenerateComponent,
    ],
    exports: [
        UcDirectiveUpperCaseModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        UcSubsectionModule,
        UcpagingModule,
        UCSearchModule,
        UcgridfooterModule,
        UclookupgenericModule,
        UcviewgenericModule,
        UcShowErrorsModule,
        UcapprovalModule,
        UcaddressModule,
        UcgridviewModule,
        UcapprovebyModule,
        MatCheckboxModule,
        UcuploadModule,
        UcapprovalhistModule,
        UcaddtotempModule,
        UcthingstodoModule,
        UcdropdownlistModule,
        UcreportModule,
        UcTestingComponent,
        UcTestComponent,
        RefAttrGenerateComponent,
        //  UcapprovalModule
    ],
    imports: [
        UcDirectiveUpperCaseModule,
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpModule,
        UcSubsectionModule,
        UcpagingModule,
        UCSearchModule,
        UcgridfooterModule,
        UclookupgenericModule,
        UcviewgenericModule,
        UcShowErrorsModule,
        UcapprovalModule,
        UcaddressModule,
        UcapprovalhistModule,
        UcgridviewModule,
        UcapprovebyModule,
        MatCheckboxModule,
        UcuploadModule,
        UcaddtotempModule,
        UcthingstodoModule,
        UcreportModule,
        UcdropdownlistModule,
        NgMultiSelectDropDownModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ]
})

export class AdInsModule { }
