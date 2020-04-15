
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgrMainInfoComponent } from './agr-main-info/agr-main-info.component';
import { AppMainInfoComponent } from './app-main-info/app-main-info.component';
import { TermConditionsComponent } from './term-conditions/term-conditions.component';
import { ShowErrorsComponent } from './show-error/show-errors.component';
import { AdInsModule } from '../../components/adins-module/adins.module';
import { VerfQuestionComponent } from './verf-question/verf-question.component';

@NgModule({
    exports: [
        AgrMainInfoComponent,
        AppMainInfoComponent,
        TermConditionsComponent,
        ShowErrorsComponent,
        AdInsModule,
        VerfQuestionComponent
    ],
    imports: [
        CommonModule,
        AdInsModule
    ],
    declarations: [
        AgrMainInfoComponent,
        AppMainInfoComponent,
        TermConditionsComponent,
        ShowErrorsComponent,
        VerfQuestionComponent
    ]
})

export class NapComponentModule { }
