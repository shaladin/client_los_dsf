import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { InvoiceDataFctrComponent } from './invoice-data-fctr/invoice-data-fctr.component';
import { TabReferantorComponent } from './tab-referantor/tab-referantor.component';
import { TabCommissionComponent } from './tab-commission/tab-commission.component';
import { ListDataCommissionComponent } from './tab-commission/list-data-commission/list-data-commission.component';
import { ViewReservedFundComponent } from "./view-reserved-fund/view-reserved-fund.component";

@NgModule({
    exports: [

    ],
    imports: [
        CommonModule,
        AdInsModule,
    ],
    declarations: [
        InvoiceDataFctrComponent,
        TabReferantorComponent,
        TabCommissionComponent,
        ListDataCommissionComponent,
        ViewReservedFundComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ViewAppComponentModule { }
