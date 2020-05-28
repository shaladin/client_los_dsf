import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { AssetLeasingPagingComponent } from "./sharing-component/input-nap-component/multi-asset-leasing/asset-leasing-paging/asset-leasing-paging.component";
import { AssetLeasingAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-leasing/asset-leasing-add-edit/asset-leasing-add-edit.component";
import { CollateralLeasingAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-leasing/collateral-leasing-add-edit/collateral-leasing-add-edit.component";
import { AssetDataPagingComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging.component";
import { AssetDataAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { MultiAssetDataComponent } from "./sharing-component/input-nap-component/multi-asset-data/multi-asset-data.component";
import { MultiAssetLeasingComponent } from "./sharing-component/input-nap-component/multi-asset-leasing/multi-asset-leasing.component";
import { CollateralFctrComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-fctr/collateral-fctr.component";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { CollateralAddEditSingleComponent } from "./sharing-component/input-nap-component/single-asset-data/collateral-add-edit-single/collateral-add-edit-single.component";
 
@NgModule({
    declarations: [
        // AssetDataPagingComponent,
        // AssetDataAddEditComponent,
        // CollateralAddEditSingleComponent
        // CollateralAddEditComponent,
        // MultiAssetDataComponent,
        // CollateralFctrComponent
        // LoanObjectComponent,
        // SearchCrossAppComponent,
        // ApplicationDataComponent,
        // ApplicationDataRefinancingComponent,
        // CollateralAddEditComponent 
        // MultiAssetLeasingComponent,
        // AssetLeasingPagingComponent,
        // AssetLeasingAddEditComponent,
        // CollateralLeasingAddEditComponent
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