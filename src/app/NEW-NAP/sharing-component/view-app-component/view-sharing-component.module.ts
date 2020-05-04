import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ViewAppCustDataPersonalComponent } from "./view-app-cust-data-personal/view-app-cust-data-personal.component";
import { ViewAppCustDataCompanyComponent } from "./view-app-cust-data-company/view-app-cust-data-company.component";
import { AdInsModule } from "app/components/adins-module/adins.module";

@NgModule({
    exports: [
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataCompanyComponent
    ],
    imports: [
        CommonModule,
        AdInsModule
    ],
    declarations: [
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataCompanyComponent
    ],
    providers: [
        NGXToastrService
    ]
})
export class ViewSharingComponentModule { }