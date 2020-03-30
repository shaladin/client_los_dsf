
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcgridfooterModule } from '@adins/ucgridfooter';
import { ShowErrorsComponent } from './show-error/show-errors.component';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { AgrMainInfoComponent } from './components/agr-main-info/agr-main-info.component';
import { TermConditionsComponent } from './components/term-conditions/term-conditions.component';


@NgModule({
    exports: [
        ShowErrorsComponent,
        AgrMainInfoComponent,
        TermConditionsComponent
    ],
    imports: [
        FormsModule,
        NgbModule,
        RouterModule,
        HttpModule,
        CommonModule,
        UcSubsectionModule,
        UcgridfooterModule,
        UcviewgenericModule
    ],
    declarations: [
        ShowErrorsComponent,
        AgrMainInfoComponent,
        TermConditionsComponent
    ]
})

export class SharingComponentModule { }
