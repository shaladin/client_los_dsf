import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { AddressTabComponent } from './address-tab/address-tab.component';
import { CustDetailPersonalComponent } from './cust-detail-tab/cust-detail-personal/cust-detail-personal.component';
import { CustDetailCompanyComponent } from './cust-detail-tab/cust-detail-company/cust-detail-company.component';

@NgModule({
    exports: [
        AddressTabComponent,
        CustDetailPersonalComponent,
        CustDetailCompanyComponent,
    ],
    imports: [
        CommonModule,
        AdInsModule,
        MatRadioModule
    ],
    declarations: [
    AddressTabComponent,
    CustDetailPersonalComponent,
    CustDetailCompanyComponent],
    providers: [
        NGXToastrService
    ]
})
export class CustCompletionComponentModule { }