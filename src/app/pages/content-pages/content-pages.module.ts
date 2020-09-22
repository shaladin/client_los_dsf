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
import { UclookupgenericModule, UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcaddressModule } from "@adins/ucaddress";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { MatRadioModule } from "@angular/material";


import { ContentPagesRoutingModule } from "app/pages/content-pages/content-pages-routing.module";
import { LoginPageComponent } from "app/pages/content-pages/login/login-page.component";
import { CustomerSelfVerificationComponent } from './external-page/customer-self-verification/customer-self-verification.component';
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { CustSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/cust-sharing-component.module";
import { PagesComponent } from './pages/pages.component'; 
import { RequestNewPasswordComponent } from "./request-new-password/request-new-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

export const customCurrencyMaskConfig = {     
    align: "left",     
    allowNegative: true,     
    allowZero: true,     
    decimal: ".",     
    precision: 2,     
    prefix: "",     
    suffix: "",     
    thousands: ",",     
    nullable: false,
    inputMode: CurrencyMaskInputMode.NATURAL };

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
        CustSharingComponentModule    
    ],
    declarations: [
        LoginPageComponent,
        CustomerSelfVerificationComponent,
        PagesComponent,
        RequestNewPasswordComponent,
        ResetPasswordComponent
    ],
      entryComponents: [
        UclookupgenericComponent,
      ]
})
export class ContentPagesModule { }
