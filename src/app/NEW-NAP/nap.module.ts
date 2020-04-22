import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AssetDataPagingComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-paging/asset-data-paging.component";
import { AssetDataAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/asset-data-add-edit/asset-data-add-edit.component";
import { CollateralAddEditComponent } from "./sharing-component/input-nap-component/multi-asset-data/collateral-add-edit/collateral-add-edit.component";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";

@NgModule({
    declarations: [
        AssetDataPagingComponent,
        AssetDataAddEditComponent,
        CollateralAddEditComponent,
    ],
    imports: [
        CommonModule,
        NapRoutingModule,
        AdInsModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class NapModule { }