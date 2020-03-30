
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
import { AgrMainInfoComponent } from './components/agr-main-info/agr-main-info.component';
import { TermConditionsComponent } from './components/term-conditions/term-conditions.component';


@NgModule({
    exports: [
        ShowErrorsComponent,
        AgrMainInfoComponent,
        TermConditionsComponent
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
        ShowErrorsComponent,
        AgrMainInfoComponent,
        TermConditionsComponent
    ]
})

export class SharingComponentModule { }
