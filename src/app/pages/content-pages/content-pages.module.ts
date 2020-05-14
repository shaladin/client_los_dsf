import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule, UcgridfooterComponent } from "@adins/ucgridfooter";
import { MatRadioModule } from "@angular/material";

import { CustJobDataComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/socmed/cust-socmed.component";
import { ContentPagesRoutingModule } from "app/pages/content-pages/content-pages-routing.module";
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";
import { CustomerSelfVerificationComponent } from './external-page/customer-self-verification/customer-self-verification.component';
import { CustomerDataComponent } from 'app/lead/verification/customer-self-verification/customer-data/customer-data.component';
import { LeadDataComponent } from 'app/lead/verification/customer-self-verification/lead-data/lead-data.component';
import { LeadInputCustDataComponent } from "app/lead/lead-input/lead-input-cust-data/lead-input-cust-data.component";
import { NgxCurrencyModule } from "ngx-currency";
import { UcinputnumberModule } from "@adins/ucinputnumber";

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
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule,
        HttpModule,
        UCSearchModule,
        UcgridfooterModule,
        UcpagingModule,
        NgbModule,
        SharingModule, 
        ReactiveFormsModule,
        UcaddressModule,
        UcSubsectionModule,
        UcShowErrorsModule,
        UclookupgenericModule,
        UcviewgenericModule,
        SharingComponentModule,
        ArchwizardModule,
        MatRadioModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        UcinputnumberModule        
    ],
    declarations: [
        LoginPageComponent,
        CustomerSelfVerificationComponent,
        CustomerDataComponent,
        LeadDataComponent,
        CustJobDataComponent,
        CustSocmedComponent,
        LeadInputCustDataComponent,
    ]
})
export class ContentPagesModule { }
