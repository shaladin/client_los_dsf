
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchwizardModule } from "angular-archwizard";
import { UcpagingModule } from "@adins/ucpaging";
import { UcviewgenericModule } from "@adins/ucviewgeneric";
import { UclookupgenericModule } from "@adins/uclookupgeneric";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CreditProcessRoutingModule } from "./credit-process-routing.module";
import { RouterModule } from "@angular/router";
import { MatCheckboxModule, MatSelectModule } from "@angular/material";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcaddressModule } from "@adins/ucaddress";
import { UcgridviewModule } from "@adins/ucgridview";
import { UCSearchModule } from '@adins/ucsearch';
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { NgxCurrencyModule } from "ngx-currency";
import { SharingComponentModule } from "../shared/sharingcomponent.module";
import { NGXToastrService } from "../components/extra/toastr/toastr.service";
import { CreditInvestigationDetailComponent } from "./credit-investigation/credit-investigation-detail/credit-investigation-detail.component";
import { ViewAppCustDataComponent } from "./credit-investigation/component/view-app-cust-data/view-app-cust-data.component";
import { CommissionAddComponent } from "./commission-add/commission-add.component";
import { CommissionPagingComponent } from "./commission-paging/commission-paging.component";
import { RsvFundPagingComponent } from "./reserved-fund/reserved-fund-paging/reserved-fund-paging.component";
import { RsvFundViewComponent } from "./reserved-fund/reserved-fund-view/reserved-fund-view.component";
import { CommissionReservedFundComponent } from './commission-reserved-fund/commission-reserved-fund.component';
import { FormAddDynamicComponent } from "./commission-add/form-add-dynamic/form-add-dynamic.component";
import { ViewFraudDetectionResultComponent } from './credit-investigation/component/view-fraud-detection-result/view-fraud-detection-result.component';
import { ViewSurveyTaskListComponent } from './credit-investigation/component/view-survey-task-list/view-survey-task-list.component';
export const customCurrencyMaskConfig = {     
    align: "left",     
    allowNegative: true,     
    allowZero: true,     
    decimal: ".",     
    precision: 2,     
    prefix: "",     
    suffix: "",     
    thousands: ",",     
    nullable: false };


@NgModule({
    declarations: [
        CreditInvestigationDetailComponent,
        ViewAppCustDataComponent,
        CommissionAddComponent,
        CommissionPagingComponent,
        RsvFundPagingComponent,
        RsvFundViewComponent,
        CommissionReservedFundComponent,
        FormAddDynamicComponent,
        ViewFraudDetectionResultComponent,
        ViewSurveyTaskListComponent
        ],
    imports: [ 
        CreditProcessRoutingModule,
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
        UcShowErrorsModule,
        UCSearchModule,
        UcinputnumberModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    exports: [],
    providers: [NGXToastrService],
})

export class CreditProcessModule { }
