import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { UCSearchModule } from "@adins/ucsearch";
import { UcpagingModule } from "@adins/ucpaging";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { UcSubsectionModule } from "@adins/uc-subsection";
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { UcgridfooterModule } from "@adins/ucgridfooter";
import { UclookupgenericComponent, UclookupgenericModule } from "@adins/uclookupgeneric";
import { UcviewgenericComponent, UcviewgenericModule } from "@adins/ucviewgeneric";
import { UcgridviewModule, UcgridviewComponent } from "@adins/ucgridview";
import { UcapprovalhistModule, UcapprovalhistComponent } from "@adins/ucapprovalhist";

import { UcShowErrorsModule } from "@adins/uc-show-errors";
import { SharedModule } from "app/shared/shared.module";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ShrCompMouModule } from "app/components/sharing-components/shr-comp-mou/shr-comp-mou.module";
import { CessieViewRoutingModule } from "./cessie-view-routing.module";
import { CessieViewComponent } from "./cessie-view.component";
import { SalesOrderComponent } from "app/impl/cessie/sharing-component/sales-order/sales-order.component";
import { CessieSummaryComponent } from "./cessie-summary/cessie-summary.component";
import { ProcessComponentModule } from "app/NEW-NAP/sharing-component/process-component/process-component.module";
import { AppCustViewComponentsModule } from "app/components/general/app-cust-view/app-cust-view.components.module";
import { MatRadioModule, MatTabsModule } from "@angular/material";
@NgModule({
    imports: [
        CessieViewRoutingModule,
        CommonModule,
        FormsModule,
        HttpModule,
        UCSearchModule,
        UcgridfooterModule,
        UcpagingModule,
        UclookupgenericModule,
        UcviewgenericModule,
        UcgridviewModule,
        NgbModule,
        SharingModule,
        ArchwizardModule,
        ReactiveFormsModule,
        UcSubsectionModule,
        SharingComponentModule,
        UcapprovalhistModule,
        UcShowErrorsModule,
        SharedModule,
        ShrCompMouModule,
        UcapprovalHistoryModule,
        ProcessComponentModule,
        AppCustViewComponentsModule,
        MatTabsModule,
    ],
    declarations: [
        CessieViewComponent,
        SalesOrderComponent,
        CessieSummaryComponent
    ],
    exports: [
        SalesOrderComponent,
        CessieSummaryComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ]

})
export class CessieViewModule { }
