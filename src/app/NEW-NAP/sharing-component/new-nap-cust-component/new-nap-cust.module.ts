import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewNapCustDetailComponent } from './new-nap-cust-detail/new-nap-cust-detail.component';
import { NewNapCustMainDataComponent } from './component/new-nap-cust-main-data/new-nap-cust-main-data.component';
import { NewNapCustPersonalFullDataComponent } from './component/personal/new-nap-cust-personal-full-data/new-nap-cust-personal-full-data.component';
import { NewNapCustAddrComponent } from './component/new-nap-cust-addr/new-nap-cust-addr.component';
import { NewNapCustPersonalEmergencyComponent } from './component/personal/new-nap-cust-personal-emergency/new-nap-cust-personal-emergency.component';
import { NewNapCustPersonalJobComponent } from './component/personal/new-nap-cust-personal-job/new-nap-cust-personal-job.component';
import { NewNapCustPersonalFinancialComponent } from './component/personal/new-nap-cust-personal-financial/new-nap-cust-personal-financial.component';
import { NewNapCustAddrDetailComponent } from './component/new-nap-cust-addr/new-nap-cust-addr-detail/new-nap-cust-addr-detail.component';
import { NewNapCustBankAccComponent } from './component/new-nap-cust-bank-acc/new-nap-cust-bank-acc.component';
import { NewNapAttrContentComponent } from './component/new-nap-other-info/new-nap-attr-content/new-nap-attr-content.component';
import { NewNapOtherInfoComponent } from './component/new-nap-other-info/new-nap-other-info.component';
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { MatRadioModule } from '@angular/material';
import { NewNapCustCompanyFullDataComponent } from './component/company/new-nap-cust-coy-full-data/new-nap-cust-coy-full-data.component';
import { NewNapCustCompanyContactInfoComponent } from './component/company/new-nap-cust-coy-contact-info/new-nap-cust-coy-contact-info.component';
import { NewNapCustCompanyFinDataComponent } from './component/company/new-nap-cust-coy-fin-data/new-nap-cust-coy-fin-data.component';
import { NewNapCustCompanyLegalDocComponent } from './component/company/new-nap-cust-coy-legal-doc/new-nap-cust-coy-legal-doc.component';
import { NewNapCustCompanyLegalDocDetailComponent } from './component/company/new-nap-cust-coy-legal-doc/new-nap-cust-coy-legal-doc-detail/new-nap-cust-coy-legal-doc-detail.component';
import { NewNapCustFamilyComponent } from './new-nap-cust-family/new-nap-cust-family.component';
import { NewNapCustGuarantorComponent } from './new-nap-cust-guarantor/new-nap-cust-guarantor.component';
import { NewNapCustShareholderComponent } from './new-nap-cust-shareholder/new-nap-cust-shareholder.component';

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
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  declarations: [
    NewNapCustDetailComponent,
    NewNapCustFamilyComponent, 
    NewNapCustGuarantorComponent,
    NewNapCustShareholderComponent,
    NewNapCustMainDataComponent, 
    NewNapCustPersonalFullDataComponent, 
    NewNapCustAddrComponent, 
    NewNapCustPersonalEmergencyComponent, 
    NewNapCustPersonalJobComponent, 
    NewNapCustPersonalFinancialComponent, 
    NewNapCustAddrDetailComponent, 
    NewNapCustBankAccComponent, 
    NewNapAttrContentComponent, 
    NewNapOtherInfoComponent, NewNapCustCompanyFullDataComponent, NewNapCustCompanyContactInfoComponent, NewNapCustCompanyFinDataComponent, NewNapCustCompanyLegalDocComponent, NewNapCustCompanyLegalDocDetailComponent],
  imports: [
    CommonModule,
    AdInsModule,
    MatRadioModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  exports: [
    NewNapCustDetailComponent,
    NewNapCustFamilyComponent,
    NewNapCustGuarantorComponent,
    NewNapCustShareholderComponent
  ],
  entryComponents: [
    NewNapCustPersonalJobComponent
  ]
})
export class NewNapCustModule { }
