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
import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { LegalDocTabComponent } from "./legal-doc-tab/legal-doc-tab.component";
import { LegalDocDetailComponent } from "./legal-doc-tab/legal-doc-detail/legal-doc-detail.component";
import { FinancialCompanyComponent } from "./financial-tab/financial-company/financial-company.component";
import { FinancialPersonalComponent } from "./financial-tab/financial-personal/financial-personal.component";
import { CcAddressPagingComponent } from './address-tab/cc-address-paging/cc-address-paging.component';
import { CcAddressDetailComponent } from './address-tab/cc-address-detail/cc-address-detail.component';
import { MgmntShrholderComponent } from './mgmnt-shrholder/mgmnt-shrholder.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FinancialPersonalXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/financial-tab/financial-personal/financial-personal-x.component";
import { FinancialCompanyXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/financial-tab/financial-company/financial-company-x.component";
import { CustBankAccDetailSectionFindataXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/financial-tab/cust-bank-acc-detail-section-findata-x/cust-bank-acc-detail-section-findata-x.component";
import { BankSectionXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/financial-tab/bank-section-x/bank-section-x.component";
import { JobTabXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/job-tab-x/job-tab-x.component";
import { CustDetailCompanyXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/cust-detail-tab/cust-detail-company-x/cust-detail-company-x.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { MgmntShrholderXComponent } from "app/impl/NEW-NAP/sharing-component/cust-completion-component/mgmnt-shrholder/mgmnt-shrholder-x.component";

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
    exports: [
        CustDetailPersonalComponent,
        CustDetailCompanyComponent,
        FamilyTabComponent,
        JobTabComponent,
        EmergencyContactTabComponent,
        FinancialCompanyComponent,
        FinancialPersonalComponent,
        BankSectionXComponent,
        CustBankAccDetailSectionFindataXComponent,
        LegalDocTabComponent,
        CcContactInformationTabComponent,
        OtherInfoTabComponent,
        CcAddressPagingComponent,
        MgmntShrholderComponent,
        MgmntShrholderXComponent,
        FinancialPersonalXComponent,
        FinancialCompanyXComponent,
        JobTabXComponent,
        CustDetailCompanyXComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule,
        MatRadioModule,
        MainDataComponentModule,
        NgMultiSelectDropDownModule,
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
        BankSectionXComponent,
        CustBankAccDetailSectionFindataXComponent,
        CcAddressPagingComponent,
        CcAddressDetailComponent,
        MgmntShrholderComponent,
        MgmntShrholderXComponent,
        FinancialPersonalXComponent,
        FinancialCompanyXComponent,
        JobTabXComponent,
        CustDetailCompanyXComponent
    ],
    providers: [
        NGXToastrService
    ],
    entryComponents: [
        CustBankAccDetailSectionFindataXComponent,
    ]
})
export class CustCompletionComponentModule { }
