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
import { MouViewChangeMouHistoryComponent } from "./mou-view-change-mou-history/mou-view-change-mou-history.component";
import { MouViewFreezeUnfreezeHistoryComponent } from "./mou-view-freeze-unfreeze-history/mou-view-freeze-unfreeze-history.component";
import { UcapprovalHistoryModule } from "@adins/ucapproval-history";
import { ViewModule } from "../view.module";
import { MouViewApprovalRecommendationComponent } from "./mou-view-approval-recommendation/mou-view-approval-recommendation.component";
import { MouViewSrvyTaskComponent } from "./mou-view-srvy-task/mou-view-srvy-task.component";
import { MouViewXComponent } from 'app/impl/view-enhancing/mou-view/mou-view-x.component';
import { MouViewAddcollXComponent } from 'app/impl/view-enhancing/mou-view/mou-view-addcoll/mou-view-addcoll-x.component';
import { MouViewDetailXComponent } from "app/impl/view-enhancing/mou-view/mou-view-detail/mou-view-detail-x.component";
import { ShrCompMouModule } from "app/components/sharing-components/shr-comp-mou/shr-comp-mou.module";
import { MouViewChangeMouHistoryXComponent } from "app/impl/view-enhancing/mou-view/mou-view-change-mou-history/mou-view-change-mou-history-x/mou-view-change-mou-history-x.component";
import { AdInsSharedModule } from "app/components/adins-module/AdInsShared.Module";
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
        AdInsSharedModule,
        UcapprovalHistoryModule,
        ShrCompMouModule,
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
        MouViewSrvyTaskComponent,
        MouViewChangeMouHistoryComponent,
        MouViewChangeMouHistoryXComponent,
        MouViewFreezeUnfreezeHistoryComponent,
        MouViewApprovalRecommendationComponent,
        MouViewXComponent,
        MouViewAddcollXComponent,
        MouViewDetailXComponent
    ],
    entryComponents: [
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ],
    exports: [
        MouViewAddcollXComponent,
        MouViewDetailXComponent
    ]

})
export class MouViewModule { }
