import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { CustomerDataComponent } from 'app/lead/verification/customer-self-verification/customer-data/customer-data.component';
import { CustJobDataComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/job-data/cust-job-data.component";
import { CustSocmedComponent } from "app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/socmed/cust-socmed.component";
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { NgxCurrencyModule } from "ngx-currency";
import { customCurrencyMaskConfig } from "app/MOU/mou.module";

@NgModule({
    exports: [
        CustomerDataComponent,
        CustJobDataComponent,
        CustSocmedComponent,
    ],
    imports: [
        CommonModule,
        AdInsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ],
    declarations: [
        CustomerDataComponent,
        CustJobDataComponent,
        CustSocmedComponent,
    ],
    providers: [
        NGXToastrService
    ]
})
export class CustSharingComponentModule { }