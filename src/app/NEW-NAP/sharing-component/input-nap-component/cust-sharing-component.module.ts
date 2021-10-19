import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { CustomerDataComponent } from 'app/lead/verification/customer-self-verification/customer-data/customer-data.component';
import { CustJobDataComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/socmed/cust-socmed.component";
import { LeadInputCustDataComponent } from "app/lead/lead-input/lead-input-cust-data/lead-input-cust-data.component";
import { LeadDataComponent } from 'app/lead/verification/customer-self-verification/lead-data/lead-data.component';
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { NgxCurrencyModule } from "ngx-currency";
import { customCurrencyMaskConfig } from "app/MOU/mou.module";
import { AdInsSharedModule } from "app/components/adins-module/AdInsShared.Module";

@NgModule({
    exports: [
        CustomerDataComponent,
        CustJobDataComponent,
        CustSocmedComponent,
        LeadInputCustDataComponent,
        LeadDataComponent
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AdInsSharedModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ],
    declarations: [
        CustomerDataComponent,
        CustJobDataComponent,
        CustSocmedComponent,
        LeadInputCustDataComponent,
        LeadDataComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class CustSharingComponentModule { }