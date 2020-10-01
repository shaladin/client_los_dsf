import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { LOSErrorDataMonitoringComponent } from "./los-error-data-monitoring/los-error-data-monitoring.component";
import { IntegrationRoutingModule } from "./integration-routing.module";

@NgModule({
    imports: [
        CommonModule,
        MatRadioModule,
        AdInsModule,
        UcSubsectionModule,
        IntegrationRoutingModule,
    ],
    declarations: [
        LOSErrorDataMonitoringComponent
    ],
    exports: [],
    providers: [
        NGXToastrService
    ]
})

export class IntegrationModule { }