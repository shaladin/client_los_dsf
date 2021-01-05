import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewNapCustDetailComponent } from './new-nap-cust-detail.component';
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
import { NgxCurrencyModule } from "ngx-currency";
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { MatRadioModule } from '@angular/material';

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
    NewNapCustMainDataComponent, 
    NewNapCustPersonalFullDataComponent, 
    NewNapCustAddrComponent, 
    NewNapCustPersonalEmergencyComponent, 
    NewNapCustPersonalJobComponent, 
    NewNapCustPersonalFinancialComponent, 
    NewNapCustAddrDetailComponent, 
    NewNapCustBankAccComponent, 
    NewNapAttrContentComponent, 
    NewNapOtherInfoComponent],
  imports: [
    CommonModule,
    AdInsModule,
    MatRadioModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  exports: [
    NewNapCustDetailComponent
  ],
  entryComponents: [
    NewNapCustPersonalJobComponent
  ]
})
export class NewNapCustModule { }
