
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
import { UcuploadModule } from '@adins/ucupload';

@NgModule({
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
        UcuploadModule
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
        UcgridviewModule,
        UcinputnumberModule,
        UcuploadModule,
        UcapprovebyModule
    ],
    declarations: [
    ]
})

export class AdInsModule { }
