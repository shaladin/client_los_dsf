import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { UcShowErrorsModule } from '@adins/uc-show-errors';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UclookupgenericModule } from '@adins/uclookupgeneric';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { MatRadioModule } from "@angular/material";


import { ContentPagesRoutingModule } from "app/pages/content-pages/content-pages-routing.module";
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";
import { CustomerSelfVerificationComponent } from './external-page/customer-self-verification/customer-self-verification.component';
import { NgxCurrencyModule } from "ngx-currency";
import { UcinputnumberModule } from "@adins/ucinputnumber";
import { CustSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/cust-sharing-component.module";
import { SubmissionPageComponent } from './external-page/submission-page/submission-page.component';

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
        UcinputnumberModule,
        CustSharingComponentModule    
    ],
    declarations: [
        LoginPageComponent,
        CustomerSelfVerificationComponent,
        SubmissionPageComponent,
    ]
})
export class ContentPagesModule { }
