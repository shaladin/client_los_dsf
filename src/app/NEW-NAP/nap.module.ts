import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service"; 
import { CollateralFctrComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-fctr/collateral-fctr.component";
import { UcSubsectionModule } from "@adins/uc-subsection";

 
@NgModule({
    declarations: [
<<<<<<< HEAD
        AssetDataPagingComponent,
        AssetDataAddEditComponent,
        CollateralAddEditComponent,
        CollateralFctrComponent
=======
        // AssetDataPagingComponent,
        // AssetDataAddEditComponent,
        // CollateralAddEditComponent,
        // LoanObjectComponent,
        // SearchCrossAppComponent,
        // ApplicationDataComponent,
        // ApplicationDataRefinancingComponent,
        // CollateralAddEditComponent 
>>>>>>> origin/master
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        NapRoutingModule,
        AdInsModule,
        UcSubsectionModule
        
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class NapModule { }