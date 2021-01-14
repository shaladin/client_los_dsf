import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { MouViewAddcollComponent } from './mou-view-addcoll/mou-view-addcoll.component';
import { MouViewDetailComponent } from './mou-view-detail/mou-view-detail.component';
import { MouViewDocComponent } from './mou-view-doc/mou-view-doc.component';
import { MouViewFeeComponent } from './mou-view-fee/mou-view-fee.component';
import { MouViewLegalComponent } from './mou-view-legal/mou-view-legal.component';
import { MouViewSurveyComponent } from './mou-view-survey/mou-view-survey.component';
import { MouViewTcComponent } from './mou-view-tc/mou-view-tc.component';
import { MouViewAnalysisResultComponent } from './mou-view-analysis-result/mou-view-analysis-result.component';
import { MouViewThirdPartyComponent } from 'app/view/mou-view/mou-view-third-party/mou-view-third-party.component';

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule
    ],
    declarations: [
        MouViewAddcollComponent,
        MouViewDetailComponent,
        MouViewDocComponent,
        MouViewFeeComponent,
        MouViewThirdPartyComponent,
        MouViewLegalComponent,
        MouViewSurveyComponent,
        MouViewTcComponent,
        MouViewAnalysisResultComponent
    ],
    exports: [
        MouViewAddcollComponent,
        MouViewDetailComponent,
        MouViewDocComponent,
        MouViewFeeComponent,
        MouViewThirdPartyComponent,
        MouViewLegalComponent,
        MouViewSurveyComponent,
        MouViewTcComponent,
        MouViewAnalysisResultComponent
    ]
})
export class MouViewComponentsModule { }
