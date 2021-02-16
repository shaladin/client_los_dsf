import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdInsModule } from "app/components/adins-module/adins.module";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { MatRadioModule } from "@angular/material";
import { UcSubsectionModule } from "@adins/uc-subsection";
import { ViewAppComponentModule } from "app/NEW-NAP/sharing-component/view-app-component/view-app-component.module";
import { SharedModule } from "app/shared/shared.module";
import { RequisitionDecisionRoutingModule } from "./requisition-decision-routing.module";
import { RequisitionDecisionPagingComponent } from './requisition-decision-paging/requisition-decision-paging.component';
import { RequisitionDecisionDetailComponent } from './requisition-decision-detail/requisition-decision-detail.component';

@NgModule({
    declarations: [
        RequisitionDecisionPagingComponent,
        RequisitionDecisionDetailComponent
    ],
    imports: [
        RequisitionDecisionRoutingModule,
        CommonModule,
        MatRadioModule,
        AdInsModule,
        UcSubsectionModule,
        ViewAppComponentModule,
        SharedModule
    ],
    providers: [
        NGXToastrService
    ]
})

export class RequisitionDecisionModule { }