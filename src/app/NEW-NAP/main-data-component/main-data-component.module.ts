import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { MainDataComponentRoutingModule } from "./main-data-component-routing.module";
import { MainDataComponentComponent } from "./main-data-component.component";
import { CustMainDataComponent } from "./cust-main-data/cust-main-data.component";
import { FamilyMainDataComponent } from "./family-main-data/family-main-data.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    declarations: [
        MainDataComponentComponent,
        CustMainDataComponent,
        FamilyMainDataComponent,
    ],
    imports: [
        CommonModule,
        MatRadioModule,
        MainDataComponentRoutingModule,
        AdInsModule,
        UcSubsectionModule,
        TranslateModule,
    ],
    exports: [],
    providers: [
        NGXToastrService
      ]
})

export class MainDataComponentModule { }