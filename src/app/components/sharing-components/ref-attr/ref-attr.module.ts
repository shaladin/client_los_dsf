import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { UcapprovalgeneralinfoModule } from '@adins/ucapprovalgeneralinfo';
import { RefAttrViewGenerateComponent } from './ref-attr-view-generate/ref-attr-view-generate.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UcdropdownlistModule } from '@adins/ucdropdownlist';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { RefAttrFormGenerateComponent } from './ref-attr-form-generate/ref-attr-form-generate.component';
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UcDirectiveUpperCaseModule } from '@adins/uc-directive-upper-case';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';

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
    imports: [
        UcDirectiveUpperCaseModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AdInsSharedModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule,
        UcapprovalgeneralinfoModule,
        UclookupgenericModule,
        UcdropdownlistModule,
        NgMultiSelectDropDownModule,
        UcShowErrorsModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ],
    declarations: [
        RefAttrViewGenerateComponent,
        RefAttrFormGenerateComponent
    ],
    exports: [
        RefAttrViewGenerateComponent,
        RefAttrFormGenerateComponent
    ]
})
export class RefAttrModule { }
