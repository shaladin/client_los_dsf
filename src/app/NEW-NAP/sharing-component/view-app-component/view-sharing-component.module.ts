import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { ViewAppCustDataPersonalComponent } from "./view-app-cust-data-personal/view-app-cust-data-personal.component";
import { ViewAppCustDataCompanyComponent } from "./view-app-cust-data-company/view-app-cust-data-company.component";

@NgModule({
    exports: [
        ViewAppCustDataPersonalComponent,
        ViewAppCustDataCompanyComponent
    ],
    imports: [
        CommonModule
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