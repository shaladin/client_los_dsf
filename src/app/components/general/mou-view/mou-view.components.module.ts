import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { MouTabViewAddcollComponent } from './mou-tab-view-addcoll/mou-tab-view-addcoll.component';
import { MouViewDetailComponent } from './mou-view-detail/mou-view-detail.component';
import { MouViewDocComponent } from './mou-view-doc/mou-view-doc.component';
import { MouViewFeeComponent } from './mou-view-fee/mou-view-fee.component';
import { MouViewLegalComponent } from './mou-view-legal/mou-view-legal.component';
import { MouViewSurveyComponent } from './mou-view-survey/mou-view-survey.component';
import { MouViewTcComponent } from './mou-view-tc/mou-view-tc.component';
import { MouViewThirdPartyComponent } from 'app/view/mou-view/mou-view-third-party/mou-view-third-party.component';
import { UcapprovalgeneralinfoModule } from '@adins/ucapprovalgeneralinfo';
import { MouViewAnalysisResultComponent } from './mou-view-analysis-result/mou-view-analysis-result.component';
import { MouViewDetailXComponent } from 'app/impl/components/general/mou-view/mou-view-detail/mou-view-detail-x.component';
import { ShrCompMouModule } from 'app/components/sharing-components/shr-comp-mou/shr-comp-mou.module';
import { MouTabViewAddcollXComponent } from 'app/impl/components/general/mou-view/mou-tab-view-addcoll/mou-tab-view-addcoll-x/mou-tab-view-addcoll-x.component';

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule,
        ShrCompMouModule,
        UcapprovalgeneralinfoModule
    ],
    declarations: [
        MouTabViewAddcollComponent,
        MouViewDetailComponent,
        MouViewDocComponent,
        MouViewFeeComponent,
        MouViewThirdPartyComponent,
        MouViewLegalComponent,
        MouViewSurveyComponent,
        MouViewTcComponent,
        MouViewAnalysisResultComponent,
        MouViewDetailXComponent,
        MouTabViewAddcollXComponent
    ],
    exports: [
        MouTabViewAddcollComponent,
        MouViewDetailComponent,
        MouViewDocComponent,
        MouViewFeeComponent,
        MouViewThirdPartyComponent,
        MouViewLegalComponent,
        MouViewSurveyComponent,
        MouViewTcComponent,
        MouViewAnalysisResultComponent,
        MouViewDetailXComponent,
        MouTabViewAddcollXComponent
    ]
})
export class MouViewComponentsModule { }
