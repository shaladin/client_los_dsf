
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

@NgModule({
    exports: [
        ShowErrorsComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        RouterModule,
        HttpModule,
        CommonModule,
        UcSubsectionModule,
        UcgridfooterModule,
        UcviewgenericModule,
        UcShowErrorsModule
    ],
    declarations: [
        ShowErrorsComponent
    ]
})

export class SharingComponentModule { }
