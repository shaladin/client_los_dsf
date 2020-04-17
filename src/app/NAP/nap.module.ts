import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchwizardModule } from "angular-archwizard";
import { UcpagingModule } from "@adins/ucpaging";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NapRoutingModule } from "./nap-routing.module";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatSelectModule } from "@angular/material";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcaddressModule } from "@adins/ucaddress";
import { UcgridviewModule } from "@adins/ucgridview";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { UCSearchModule } from '@adins/ucsearch';
import { CommissionPagingComponent } from '../credit-process/commission-paging/commission-paging.component';
import { AppTcComponent } from './nap-tab/app-tc/app-tc.component';
import { AppFinDataComponent } from './nap-tab/app-fin-data/app-fin-data.component';
import { AppSubsidyComponent } from './nap-tab/app-fin-data/component/app-subsidy/app-subsidy.component';
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { AppSubsidyAddEditComponent } from './nap-tab/app-fin-data/component/app-subsidy-add-edit/app-subsidy-add-edit.component';
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppFeeComponent } from './nap-tab/app-fin-data/component/app-fee/app-fee.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { PhnVerifPagingComponent } from "./phone-verif/phone-verif-paging/phone-verif-paging.component";
import { RsvFundViewComponent } from "app/credit-process/reserved-fund/reserved-fund-view/reserved-fund-view.component";
import { VerfQuestionComponent } from "./nap-component/verf-question/verf-question.component";
export const customCurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ".",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ",",
    nullable: false
};
import { PhnVerifSubjectComponent } from "./phone-verif/phone-verif-subject/phone-verif-subject.component";
import { PhnVerifSubjectViewComponent } from "./phone-verif/phone-verif-subject-view/phone-verif-subject-view.component";
import { PhnVerifSubjectVerifComponent } from "./phone-verif/phone-verif-subject-verif/phone-verif-subject-verif.component";
import { AppFromLeadPagingComponent } from "./app-from-lead/paging/app-from-lead-paging.component";
import { AppFromLeadDetailComponent } from "./app-from-lead/detail/app-from-lead-detail.component";



@NgModule({
    declarations: [
        CommissionPagingComponent,
        AppFinDataComponent,
        AppSubsidyComponent,
        AppSubsidyAddEditComponent,
        AppFeeComponent,
        AppTcComponent,
        RsvFundViewComponent,
        AppFinDataComponent,
        AppFinDataComponent,
        PhnVerifPagingComponent,
        VerfQuestionComponent,
        PhnVerifPagingComponent,
        PhnVerifSubjectComponent,
        PhnVerifSubjectViewComponent,
        PhnVerifSubjectVerifComponent,
        PhnVerifPagingComponent,
        AppFromLeadPagingComponent,
        AppFromLeadDetailComponent
        ],
    imports: [
        NapRoutingModule,
        CommonModule,
        ArchwizardModule,
        UcpagingModule,
        UcviewgenericModule,
        UclookupgenericModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        CommonModule,
        RouterModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        UcSubsectionModule,
        SharingComponentModule, 
        UcaddressModule,
        UcgridviewModule,
        UCSearchModule,
        UcShowErrorsModule,
        NgbModule,
        UcinputnumberModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    exports: [],
    entryComponents: [AppSubsidyAddEditComponent],
    providers: [NGXToastrService,NgbActiveModal],
})

export class NapModule { }
