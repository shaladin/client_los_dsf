import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";

@NgModule({
    exports: [
        AppCustViewComponentsModule
    ],
    imports: [
        CommonModule,
        AdInsModule,
        AppCustViewComponentsModule
    ],
    declarations: [
    ],
    providers: [
        NGXToastrService
    ]
})
export class ViewSharingComponentModule { }
