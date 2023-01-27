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
import { ChangeMouViewAddcollComponent } from "./change-mou-view-addcoll/change-mou-view-addcoll.component";
import { ChangeMouViewDetailComponent } from "./change-mou-view-detail/change-mou-view-detail.component";
import { ChangeMouViewComponent } from "./change-mou-view.component";
import { ChangeMouViewRoutingModule } from "./change-mou-view-routing.module";
import { ChangeMouMainInfoComponent } from "../change-mou-main-info/change-mou-main-info.component";
import { ChangeMouViewXComponent } from '../../impl/view-enhancing/change-mou-view/change-mou-view-x.component';
import { ChangeMouViewAddcollXComponent } from '../../impl/view-enhancing/change-mou-view/change-mou-view-addcoll/change-mou-view-addcoll-x.component';
import { ChangeMouMainInfoXComponent } from '../../impl/view-enhancing/change-mou-main-info/change-mou-main-info-x.component';
import { ChangeMouViewDetailXComponent } from "app/impl/view-enhancing/change-mou-view/change-mou-view-detail/change-mou-view-detail-x.component";
import { ShrCompMouModule } from "app/components/sharing-components/shr-comp-mou/shr-comp-mou.module";
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { ChangeMouViewAddcollHistoryXComponent } from "app/impl/view-enhancing/change-mou-view/change-mou-view-addcoll-history/change-mou-view-addcoll-history-x.component";
import { ChangeMouViewAddcollHistoryVerXComponent } from "app/impl/view-enhancing/change-mou-view/change-mou-view-addcoll-history-ver/change-mou-view-addcoll-history-ver-x.component";
import { ChangeMouViewDetailHistoryXComponent } from "app/impl/view-enhancing/change-mou-view/change-mou-view-detail-history/change-mou-view-detail-history-x.component";
import { ChangeMouAddcollMouViewXComponent } from "app/impl/view-enhancing/change-mou-view/change-mou-addcoll-mou-view/change-mou-addcoll-mou-view-x.component";

@NgModule({
    imports: [
        ChangeMouViewRoutingModule,
        CommonModule,
        FormsModule,
        AdInsSharedModule,
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
    ],
    declarations: [
        ChangeMouViewAddcollComponent,
        ChangeMouViewDetailComponent,
        ChangeMouViewComponent,
        ChangeMouMainInfoComponent,
        ChangeMouViewXComponent,
        ChangeMouViewAddcollXComponent,
        ChangeMouMainInfoXComponent,
        ChangeMouViewDetailXComponent,
        ChangeMouViewAddcollHistoryXComponent,
        ChangeMouViewAddcollHistoryVerXComponent,
        ChangeMouViewDetailHistoryXComponent
    ],
    entryComponents: [
        ChangeMouViewAddcollComponent,
        UclookupgenericComponent,
        UcviewgenericComponent,
        UcgridviewComponent,
        UcapprovalhistComponent,
    ],
    exports: [
      ChangeMouViewDetailXComponent,
      ChangeMouAddcollMouViewXComponent
    ]

})
export class ChangeMouViewModule { }
