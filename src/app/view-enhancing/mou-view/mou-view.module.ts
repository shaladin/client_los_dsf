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
import { MouViewComponent } from "./mou-view.component";
import { MouViewRoutingModule } from "./mou-view-routing.module";
import { MouViewDetailComponent } from "./mou-view-detail/mou-view-detail.component";
import { MouViewAddcollComponent } from "./mou-view-addcoll/mou-view-addcoll.component";
import { MouViewApprovalHistoryComponent } from "./mou-view-approval-history/mou-view-approval-history.component";
import { MouViewDocComponent } from "./mou-view-doc/mou-view-doc.component";
import { MouViewFeeComponent } from "./mou-view-fee/mou-view-fee.component";
import { MouViewLegalComponent } from "./mou-view-legal/mou-view-legal.component";
import { MouViewListedCustFactoringComponent } from "./mou-view-listed-cust-factoring/mou-view-listed-cust-factoring.component";
import { MouViewSurveyComponent } from "./mou-view-survey/mou-view-survey.component";
import { MouViewTcComponent } from "./mou-view-tc/mou-view-tc.component";
import { SharedModule } from "app/shared/shared.module";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ViewModule } from "../view.module";
@NgModule({
    imports: [
        MouViewRoutingModule,
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
        UcapprovalHistoryModule,
        ViewModule
    ],
    declarations: [
        MouViewComponent,
        MouViewDetailComponent,
        MouViewAddcollComponent,
        MouViewApprovalHistoryComponent,
        MouViewDocComponent,
        MouViewFeeComponent,
        MouViewLegalComponent,
        MouViewListedCustFactoringComponent,
        MouViewSurveyComponent,
        MouViewTcComponent,
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ]

})
export class MouViewModule { }