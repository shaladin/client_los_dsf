import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NapRoutingModule } from "./nap-routing.module";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { LoanObjectComponent } from "./sharing-component/input-nap-component/application-data/loan-object/loan-object.component";
import { SearchCrossAppComponent } from "./sharing-component/input-nap-component/application-data/search-cross-app/search-cross-app.component";
import { ApplicationDataComponent } from "./sharing-component/input-nap-component/application-data/application-data.component";
import { MatRadioModule } from "@angular/material";
import { ApplicationDataRefinancingComponent } from "./sharing-component/input-nap-component/application-data/application-data-refinancing/application-data-refinancing.component";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service"; 

 
@NgModule({
    declarations: [
        // AssetDataPagingComponent,
        // AssetDataAddEditComponent,
        // CollateralAddEditComponent,
        LoanObjectComponent,
        SearchCrossAppComponent,
        ApplicationDataComponent,
        ApplicationDataRefinancingComponent,
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