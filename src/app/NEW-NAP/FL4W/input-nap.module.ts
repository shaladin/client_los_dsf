import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { DummyComponent } from './dummy/dummy.component';
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InputNapFL4WRoutingModule } from "./input-nap-routing.module";
import { ArchwizardModule } from "angular-archwizard";
import { InputNapComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/input-nap-component.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms"; 
import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharingComponentModule } from "app/shared/sharingcomponent.module";
import { UcinputnumberModule } from "@adins/ucinputnumber"; 
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapViewComponent } from './nap-view/nap-view.component';  
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";
import { CustCompanyFinancialDataComponent } from "./nap-tab/customer-data/component/company-financial-data/cust-company-financial-data.component"; 
import { CustPersonalMainDataComponent } from "./nap-tab/customer-data/component/personal-main-data/cust-personal-main-data.component";
import { CustPersonalContactInformationComponent } from "./nap-tab/customer-data/component/personal-contact-information/cust-personal-contact-information.component";
import { CustPersonalFinancialDataComponent } from "./nap-tab/customer-data/component/personal-financial-data/cust-personal-financial-data.component";
import { CustBankAccountComponent } from "./nap-tab/customer-data/component/bank-account/cust-bank-account.component";
import { CustJobDataComponent } from "./nap-tab/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "./nap-tab/customer-data/component/socmed/cust-socmed.component";
import { CustGrpMemberComponent } from "./nap-tab/customer-data/component/cust-grp-member/cust-grp-member.component";
import { CustCompanyMainDataComponent } from "./nap-tab/customer-data/component/company-main-data/cust-company-main-data.component";
import { CustShareholderComponent } from "./nap-tab/customer-data/component/shareholder/cust-shareholder.component";
import { CustCompanyContactInformationComponent } from "./nap-tab/customer-data/component/company-contact-information/cust-company-contact-information.component";
import { CustLegalDocComponent } from "./nap-tab/customer-data/component/legal-doc/cust-legal-doc.component";
import { GuarantorComponent } from "../sharing-component/view-app-component/guarantor/guarantor.component";
import { GuarantorPagingComponent } from "./nap-tab/guarantor-data/guarantor-paging/guarantor-paging.component";
import { GuarantorPersonalComponent } from "./nap-tab/guarantor-data/guarantor-personal/guarantor-personal.component";
import { GuarantorCompanyComponent } from "./nap-tab/guarantor-data/guarantor-company/guarantor-company.component";
import { ReferantorDataComponent } from "./nap-tab/referantor-data/referantor-data.component";
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { NgxCurrencyModule } from "ngx-currency";
import { customCurrencyMaskConfig } from "app/MOU/mou.module";
import { CustUcaddressComponent } from "./nap-tab/customer-data/component/address/ucaddress.component";
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';

@NgModule({
  imports: [
    CommonModule,
    InputNapFL4WRoutingModule,
    AdInsModule,
    InputNapComponentModule,
    ArchwizardModule,
    UcShowErrorsModule,
    NgbModule, 
    ReactiveFormsModule,
    FormsModule,
    SharingComponentModule,
    UcinputnumberModule, 
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    DummyComponent, 
    NapAddComponent,
    NapPagingComponent,
    NapViewComponent, 
    CustomerDataComponent,
    CustCompanyFinancialDataComponent,
    CustUcaddressComponent,
    CustPersonalMainDataComponent,
    CustPersonalContactInformationComponent,
    CustPersonalFinancialDataComponent,
    CustBankAccountComponent,
    CustJobDataComponent,
    CustSocmedComponent,
    CustGrpMemberComponent,
    CustCompanyMainDataComponent,
    CustShareholderComponent,
    CustCompanyContactInformationComponent,
    CustLegalDocComponent,
    GuarantorComponent,
    GuarantorPagingComponent,
    GuarantorPersonalComponent,
    GuarantorCompanyComponent,
    ReferantorDataComponent,
    NapAddDetailComponent,  
  ],
  providers: [
    NGXToastrService
  ] 
})
export class InputNapFL4WModule { }