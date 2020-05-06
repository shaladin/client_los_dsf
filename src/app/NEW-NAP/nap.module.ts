import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { MatRadioModule } from "@angular/material";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service"; 
import { CollateralFctrComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-fctr/collateral-fctr.component";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { AssetDataAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { AssetDataPagingComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging.component";

 
@NgModule({
    declarations: [
        AssetDataPagingComponent,
        AssetDataAddEditComponent,
        CollateralAddEditComponent,
        CollateralFctrComponent
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
        UcSubsectionModule
        
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class NapModule { }