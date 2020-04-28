import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AssetDataPagingComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging.component";
import { AssetDataAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { LoanObjectComponent } from "./sharing-component/input-nap-component/application-data/loan-object/loan-object.component";
import { SearchCrossAppComponent } from "./sharing-component/input-nap-component/application-data/search-cross-app/search-cross-app.component";
import { ApplicationDataComponent } from "./sharing-component/input-nap-component/application-data/application-data.component";
import { MatRadioModule } from "@angular/material";
import { ApplicationDataRefinancingComponent } from "./sharing-component/input-nap-component/application-data/application-data-refinancing/application-data-refinancing.component";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service"; 

@NgModule({
    declarations: [
        AssetDataPagingComponent,
        AssetDataAddEditComponent,
        CollateralAddEditComponent,
        LoanObjectComponent,
        SearchCrossAppComponent,
        ApplicationDataComponent,
        ApplicationDataRefinancingComponent,
        CollateralAddEditComponent 
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