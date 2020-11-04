import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { CustDetailPersonalComponent } from './cust-detail-tab/cust-detail-personal/cust-detail-personal.component';
import { CustDetailCompanyComponent } from './cust-detail-tab/cust-detail-company/cust-detail-company.component';
import { FamilyTabComponent } from './family-tab/family-tab.component';
import { JobTabComponent } from './job-tab/job-tab.component';
import { MainDataComponentModule } from "../main-data-component/main-data-component.module";
import { EmergencyContactTabComponent } from './emergency-contact-tab/emergency-contact-tab.component';
import { CcContactInformationTabComponent } from './cc-contact-information-tab/cc-contact-information-tab.component';
import { OtherInfoTabComponent } from './other-info-tab/other-info-tab.component';
import { AttrContentComponentComponent } from './attr-content-component/attr-content-component.component';
import { BankSectionComponent } from './financial-tab/bank-section/bank-section.component';
import { NgxCurrencyModule } from "ngx-currency";
import { LegalDocTabComponent } from "./legal-doc-tab/legal-doc-tab.component";
import { LegalDocDetailComponent } from "./legal-doc-tab/legal-doc-detail/legal-doc-detail.component";
import { FinancialCompanyComponent } from "./financial-tab/financial-company/financial-company.component";
import { FinancialPersonalComponent } from "./financial-tab/financial-personal/financial-personal.component";
import { CcAddressPagingComponent } from './address-tab/cc-address-paging/cc-address-paging.component';
import { CcAddressDetailComponent } from './address-tab/cc-address-detail/cc-address-detail.component';

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
    exports: [
        CustDetailPersonalComponent,
        CustDetailCompanyComponent,
        FamilyTabComponent,
        JobTabComponent,
        EmergencyContactTabComponent,
        FinancialCompanyComponent,
        FinancialPersonalComponent,
        LegalDocTabComponent,
        CcContactInformationTabComponent,
        OtherInfoTabComponent,
        CcAddressPagingComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        MatRadioModule,
        MainDataComponentModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    declarations: [
        CustDetailPersonalComponent,
        CustDetailCompanyComponent,
        FamilyTabComponent,
        JobTabComponent,
        EmergencyContactTabComponent,
        CcContactInformationTabComponent,
        OtherInfoTabComponent,
        AttrContentComponentComponent,
        BankSectionComponent,
        LegalDocTabComponent,
        LegalDocDetailComponent,
        FinancialCompanyComponent,
        FinancialPersonalComponent,
        CcAddressPagingComponent,
        CcAddressDetailComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class CustCompletionComponentModule { }