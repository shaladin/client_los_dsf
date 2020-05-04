import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service"; 

 
@NgModule({
    declarations: [
        // AssetDataPagingComponent,
        // AssetDataAddEditComponent,
        // CollateralAddEditComponent,
        // LoanObjectComponent,
        // SearchCrossAppComponent,
        // ApplicationDataComponent,
        // ApplicationDataRefinancingComponent,
        // CollateralAddEditComponent 
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        NapRoutingModule,
        AdInsModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class NapModule { }