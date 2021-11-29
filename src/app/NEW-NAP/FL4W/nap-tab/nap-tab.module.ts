import { NgModule } from "@angular/core"; 
 
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { TcSharingComponentModule } from "app/NEW-NAP/sharing-component/input-nap-component/tc-sharing-component.module";
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { SubsidyAddEditComponent } from "app/NEW-NAP/sharing-component/input-nap-component/financial-data/component/subsidy-add-edit/subsidy-add-edit.component";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service"; 
import { CustUcaddressFL4WComponent } from "./customer-data/component/address/ucaddressFL4W.component";
import { CustPersonalMainDataFL4WComponent } from "./customer-data/component/personal-main-data/cust-personal-main-data-FL4W.component";
import { CustPersonalContactInformationFL4WComponent } from "./customer-data/component/personal-contact-information/cust-personal-contact-information-FL4W.component";
import { CustPersonalFinancialDataFL4WComponent } from "./customer-data/component/personal-financial-data/cust-personal-financial-data-FL4W.component";
import { CustBankAccountFL4WComponent } from "./customer-data/component/bank-account/cust-bank-account-FL4W.component";
import { CustJobDataFL4WComponent } from "./customer-data/component/job-data/cust-job-data-FL4W.component";
import { CustSocmedFL4WComponent } from "./customer-data/component/socmed/cust-socmed-FL4W.component";
import { CustGrpMemberFL4WComponent } from "./customer-data/component/cust-grp-member/cust-grp-member-FL4W.component";
import { CustCompanyMainDataFL4WComponent } from "./customer-data/component/company-main-data/cust-company-main-data-FL4W.component";
import { CustShareholderFL4WComponent } from "./customer-data/component/shareholder/cust-shareholder-FL4W.component";
import { CustCompanyContactInformationFL4WComponent } from "./customer-data/component/company-contact-information/cust-company-contact-information.component-FL4W";
import { CustCompanyFinancialDataFL4WComponent } from "./customer-data/component/company-financial-data/cust-company-financial-data-FL4W.component";
import { CustLegalDocFL4WComponent } from "./customer-data/component/legal-doc/cust-legal-doc-FL4W.component";
import { GuarantorFL4WComponent } from "./guarantor-data/guarantor-FL4W.component";
import { GuarantorPagingFL4WComponent } from "./guarantor-data/guarantor-paging/guarantor-paging-FL4W.component";
import { GuarantorPersonalFL4WComponent } from "./guarantor-data/guarantor-personal/guarantor-personal-FL4W.component";
import { GuarantorCompanyFL4WComponent } from "./guarantor-data/guarantor-company/guarantor-company-FL4W.component";
import { ReferantorDataFL4WComponent } from "./referantor-data/referantor-data-FL4W.component";
import { CustomerDataFL4WComponent } from "./customer-data/customer-data-FL4W.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";

 
export const customCurrencyMaskConfig = {     
  align: "right",     
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
  exports: [
    CustomerDataFL4WComponent,
    CustUcaddressFL4WComponent,
    CustPersonalMainDataFL4WComponent,
    CustPersonalContactInformationFL4WComponent,
    CustPersonalFinancialDataFL4WComponent,
    CustBankAccountFL4WComponent,
    CustJobDataFL4WComponent,
    CustSocmedFL4WComponent,
    CustGrpMemberFL4WComponent,
    CustCompanyMainDataFL4WComponent,
    CustShareholderFL4WComponent,
    CustCompanyContactInformationFL4WComponent,
    CustCompanyFinancialDataFL4WComponent,
    CustLegalDocFL4WComponent, 
    GuarantorFL4WComponent,
    GuarantorPagingFL4WComponent,
    GuarantorPersonalFL4WComponent,
    GuarantorCompanyFL4WComponent, 
    ReferantorDataFL4WComponent,
   
  ],
  imports: [
    CommonModule,
    AdInsModule,
    AdInsSharedModule,
    TcSharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    CustomerDataFL4WComponent,
    CustUcaddressFL4WComponent,
    CustPersonalMainDataFL4WComponent,
    CustPersonalContactInformationFL4WComponent,
    CustPersonalFinancialDataFL4WComponent,
    CustBankAccountFL4WComponent,
    CustJobDataFL4WComponent,
    CustSocmedFL4WComponent,
    CustGrpMemberFL4WComponent,
    CustCompanyMainDataFL4WComponent,
    CustShareholderFL4WComponent,
    CustCompanyContactInformationFL4WComponent,
    CustCompanyFinancialDataFL4WComponent,
    CustLegalDocFL4WComponent, 
    GuarantorFL4WComponent,
    GuarantorPagingFL4WComponent,
    GuarantorPersonalFL4WComponent,
    GuarantorCompanyFL4WComponent, 
    ReferantorDataFL4WComponent,
   
  ],
  entryComponents: [SubsidyAddEditComponent],
  providers: [
    NGXToastrService
  ]
})
export class NapTabComponentModule { }