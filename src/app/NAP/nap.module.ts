import { AppAddComponent } from "./app-add/app-add.component";
import { AppPagingComponent } from "./app-paging/app-paging.component";
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
import { AppAddDetailComponent } from './app-add-detail/app-add-detail.component';
import { MatCheckboxModule, MatSelectModule } from "@angular/material";
import { AppReferantorComponent } from "./nap-tab/app-referantor/app-referantor.component";
import { AppModelComponent } from './nap-tab/app-model/app-model.component';
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { UcaddressModule } from "@adins/ucaddress";
import { UcgridviewModule } from "@adins/ucgridview";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { CustPersonalMainDataComponent } from "./nap-tab/customer-data/component/personal-main-data/cust-personal-main-data.component";
import { CustUcaddressComponent } from "./nap-tab/customer-data/component/address/ucaddress.component";
import { AppGuarantorComponent } from "./nap-tab/app-guarantor/app-guarantor.component";
import { GuarantorCompanyComponent } from "./nap-tab/app-guarantor/guarantor-company/guarantor-company.component";
import { GuarantorPagingComponent } from "./nap-tab/app-guarantor/guarantor-paging/guarantor-paging.component";
import { GuarantorPersonalComponent } from "./nap-tab/app-guarantor/guarantor-personal/guarantor-personal.component";
import { AppLifeInsComponent } from './nap-tab/app-life-ins/app-life-ins.component';
import { CustPersonalContactInformationComponent } from "./nap-tab/customer-data/component/personal-contact-information/cust-personal-contact-information.component";
import { CustPersonalFinancialDataComponent } from "./nap-tab/customer-data/component/personal-financial-data/cust-personal-financial-data.component";
import { SearchCrossAppComponent } from './nap-tab/app-model/search-cross-app/search-cross-app.component';
import { UCSearchModule } from '@adins/ucsearch';
import { CommissionPagingComponent } from '../credit-process/commission-paging/commission-paging.component';
// import { CustFinancialDataComponent } from "./nap-tab/customer-data/component/financial-data/cust-financial-data.component";
import { CustBankAccountComponent } from "./nap-tab/customer-data/component/bank-account/cust-bank-account.component";
import { CustJobDataComponent } from "./nap-tab/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "./nap-tab/customer-data/component/socmed/cust-socmed.component";
import { CustGrpMemberComponent } from "./nap-tab/customer-data/component/cust-grp-member/cust-grp-member.component";
import { CustCompanyMainDataComponent } from "./nap-tab/customer-data/component/company-main-data/cust-company-main-data.component";
import { CustShareholderComponent } from "./nap-tab/customer-data/component/shareholder/cust-shareholder.component";
import { AppTcComponent } from './nap-tab/app-tc/app-tc.component';
import { CustCompanyContactInformationComponent } from "./nap-tab/customer-data/component/company-contact-information/cust-company-contact-information.component";
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { CustCompanyFinancialDataComponent } from "./nap-tab/customer-data/component/company-financial-data/cust-company-financial-data.component";
import { CustLegalDocComponent } from "./nap-tab/customer-data/component/legal-doc/cust-legal-doc.component";
import { UcinputnumberComponent } from "./nap-tab/customer-data/component/ucinputnumber/ucinputnumber.component";
import { InsuranceDataComponent } from "./nap-tab/insurance-data/insurance-data.component";
import { AssetDataComponent } from "./nap-tab/asset-data/asset-data.component";
import { AppFinDataComponent } from './nap-tab/app-fin-data/app-fin-data.component';
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
import { PhnVerifPagingComponent } from "./phone-verif/phone-verif-paging/phone-verif-paging.component";



@NgModule({
    declarations: [
        AppAddComponent,
        AppPagingComponent,
        AppAddDetailComponent,
        AppReferantorComponent,
        CustomerDataComponent,
        CustUcaddressComponent,
        AppModelComponent,
        CustomerDataComponent,
        CustPersonalMainDataComponent,
        CustUcaddressComponent,
        GuarantorPagingComponent,
        GuarantorPersonalComponent,
        GuarantorCompanyComponent,
        CustUcaddressComponent,
        AppGuarantorComponent,
        AppLifeInsComponent,
        CustPersonalContactInformationComponent,
        CustPersonalFinancialDataComponent,
        CustBankAccountComponent,
        CustJobDataComponent,
        CustSocmedComponent,
        CustGrpMemberComponent,
        CustCompanyMainDataComponent,
        CustShareholderComponent,
        CustCompanyContactInformationComponent,
        CustCompanyFinancialDataComponent,
        SearchCrossAppComponent,
        CommissionPagingComponent,
        CustShareholderComponent,
        AppTcComponent,
        CustLegalDocComponent,
        UcinputnumberComponent,
        InsuranceDataComponent,
        AssetDataComponent,
        AppFinDataComponent,
        PhnVerifPagingComponent
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
        UcShowErrorsModule,
        UCSearchModule,
        UcinputnumberModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    exports: [],
    providers: [NGXToastrService],
})

export class NapModule { }
