import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewNapCustDetailComponent } from './new-nap-cust-detail/new-nap-cust-detail.component';
import { NewNapCustMainDataComponent } from './new-nap-cust-detail/component/new-nap-cust-main-data/new-nap-cust-main-data.component';
import { NewNapCustPersonalFullDataComponent } from './new-nap-cust-detail/component/personal/new-nap-cust-personal-full-data/new-nap-cust-personal-full-data.component';
import { NewNapCustAddrComponent } from './new-nap-cust-detail/component/new-nap-cust-addr/new-nap-cust-addr.component';
import { NewNapCustPersonalEmergencyComponent } from './new-nap-cust-detail/component/personal/new-nap-cust-personal-emergency/new-nap-cust-personal-emergency.component';
import { NewNapCustPersonalJobComponent } from './new-nap-cust-detail/component/personal/new-nap-cust-personal-job/new-nap-cust-personal-job.component';
import { NewNapCustPersonalFinancialComponent } from './new-nap-cust-detail/component/personal/new-nap-cust-personal-financial/new-nap-cust-personal-financial.component';
import { NewNapCustAddrDetailComponent } from './new-nap-cust-detail/component/new-nap-cust-addr/new-nap-cust-addr-detail/new-nap-cust-addr-detail.component';
import { NewNapCustBankAccComponent } from './new-nap-cust-detail/component/new-nap-cust-bank-acc/new-nap-cust-bank-acc.component';
import { NewNapAttrContentComponent } from './new-nap-cust-detail/component/new-nap-other-info/new-nap-attr-content/new-nap-attr-content.component';
import { NewNapOtherInfoComponent } from './new-nap-cust-detail/component/new-nap-other-info/new-nap-other-info.component';
import { NgxCurrencyModule } from "ngx-currency";
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { MatRadioModule } from '@angular/material';
import { NewNapCustCompanyFullDataComponent } from './new-nap-cust-detail/component/company/new-nap-cust-company-full-data/new-nap-cust-company-full-data.component';
import { NewNapCustCompanyContactInfoComponent } from './new-nap-cust-detail/component/company/new-nap-cust-company-contact-info/new-nap-cust-company-contact-info.component';
import { NewNapCustCompanyFinDataComponent } from './new-nap-cust-detail/component/company/new-nap-cust-company-fin-data/new-nap-cust-company-fin-data.component';
import { NewNapCustCompanyLegalDocComponent } from './new-nap-cust-detail/component/company/new-nap-cust-company-legal-doc/new-nap-cust-company-legal-doc.component';
import { NewNapCustCompanyLegalDocDetailComponent } from './new-nap-cust-detail/component/company/new-nap-cust-company-legal-doc/new-nap-cust-company-legal-doc-detail/new-nap-cust-company-legal-doc-detail.component';
import { NewNapCustFamilyComponent } from './new-nap-cust-family/new-nap-cust-family.component';

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

@NgModule({
  declarations: [
    NewNapCustDetailComponent,
    NewNapCustFamilyComponent, 
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
    NewNapCustFamilyComponent
  ],
  entryComponents: [
    NewNapCustPersonalJobComponent
  ]
})
export class NewNapCustModule { }
