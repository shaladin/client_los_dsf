
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
import { PageTestingComponent } from './page-testing/page-testing.component';
import { UcTesting2Component } from './uc-testing2/uc-testing2.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

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
    inputMode: CurrencyMaskInputMode.NATURAL };
    
@NgModule({
    declarations: [
        UcTestingComponent,
        PageTestingComponent,
        UcTesting2Component
    ],
    exports: [
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
        UcTestingComponent
        //  UcapprovalModule
    ],
    imports: [
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
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ]
})

export class AdInsModule { }
