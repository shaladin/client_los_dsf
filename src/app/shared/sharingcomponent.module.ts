
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcgridfooterModule } from '@adins/ucgridfooter';
import { ShowErrorsComponent } from './show-error/show-errors.component';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { MatTabsModule } from '@angular/material';
import { UcthingstodoModule } from '@adins/ucthingstodo';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';


@NgModule({
    exports: [
        ShowErrorsComponent,
        UcthingstodoModule
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        AdInsSharedModule,
        RouterModule,
        HttpModule,
        CommonModule,
        UcSubsectionModule,
        UcgridfooterModule,
        UcviewgenericModule,
        UcShowErrorsModule,
        MatTabsModule,
        UcthingstodoModule
    ],
    declarations: [
        ShowErrorsComponent
    ]
})

export class SharingComponentModule { }
