
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
import { UcinputnumberModule } from '@adins/ucinputnumber';
import { UcapprovebyModule } from '@adins/ucapproveby';
import { UcaddressModule } from '@adins/ucaddress';
import { MatCheckboxModule } from '@angular/material';
import { UcuploadModule } from '@adins/ucupload';
import { UcapprovalhistModule } from '@adins/ucapprovalhist';
import { UcaddtotempModule } from '@adins/ucaddtotemp';
import { UcthingstodoModule } from '@adins/ucthingstodo';

@NgModule({
    declarations:[
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
        UcinputnumberModule,
        UcapprovebyModule,
        MatCheckboxModule,
        UcuploadModule,
        UcapprovalhistModule,
        UcaddtotempModule,
        UcthingstodoModule,
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
        UcinputnumberModule,
        UcapprovebyModule,
        MatCheckboxModule,
        UcuploadModule,
        UcaddtotempModule,
        UcthingstodoModule
    ]
})

export class AdInsModule { }
