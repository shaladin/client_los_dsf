import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { AddressTabComponent } from './address-tab/address-tab.component';
import { CustDetailPersonalComponent } from './cust-detail-tab/cust-detail-personal/cust-detail-personal.component';
import { CustDetailCompanyComponent } from './cust-detail-tab/cust-detail-company/cust-detail-company.component';
import { FamilyTabComponent } from './family-tab/family-tab.component';
import { JobTabComponent } from './job-tab/job-tab.component';
import { MainDataComponentModule } from "../main-data-component/main-data-component.module";
import { EmergencyContactTabComponent } from './emergency-contact-tab/emergency-contact-tab.component';
import { CcContactInformationTabComponent } from './cc-contact-information-tab/cc-contact-information-tab.component';
import { OtherInfoTabComponent } from './other-info-tab/other-info-tab.component';
import { AttrContentComponentComponent } from './attr-content-component/attr-content-component.component';
import { FinancialTabComponent } from './financial-tab/financial-tab.component';
import { BankSectionComponent } from './financial-tab/bank-section/bank-section.component';
import { NgxCurrencyModule } from "ngx-currency";

export const customCurrencyMaskConfig = {
    align: "left",
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
    exports: [
        AddressTabComponent,
        CustDetailPersonalComponent,
        CustDetailCompanyComponent,
        FamilyTabComponent,
        JobTabComponent,
        EmergencyContactTabComponent,
        FinancialTabComponent,
        CcContactInformationTabComponent,
        OtherInfoTabComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        MatRadioModule,
        MainDataComponentModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    declarations: [
        AddressTabComponent,
        CustDetailPersonalComponent,
        CustDetailCompanyComponent,
        FamilyTabComponent,
        JobTabComponent,
        EmergencyContactTabComponent,
        CcContactInformationTabComponent,
        OtherInfoTabComponent,
        AttrContentComponentComponent,
        FinancialTabComponent,
        BankSectionComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class CustCompletionComponentModule { }