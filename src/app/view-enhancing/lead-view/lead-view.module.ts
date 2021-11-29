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
import { LeadViewComponent } from "./lead-view.component";
import { ViewLeadDataComponent } from "./view-lead-data/view-lead-data.component";
import { ViewCustomerDataComponent } from "./view-customer-data/view-customer-data.component";
import { LeadViewRoutingModule } from "./lead-view-routing.module";
import { SharedModule } from "app/shared/shared.module";
import { LeadViewSrvyTaskComponent } from "./lead-view-srvy-task/lead-view-srvy-task.component";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";


@NgModule({
    imports: [
        LeadViewRoutingModule,
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
        AdInsSharedModule,
        SharedModule
    ],
    declarations: [
        LeadViewComponent,
        ViewLeadDataComponent,
        ViewCustomerDataComponent,
        LeadViewSrvyTaskComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ],
    exports: [
    ]

})
export class LeadViewModule { }