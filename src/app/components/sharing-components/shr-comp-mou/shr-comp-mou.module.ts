import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { UcapprovalgeneralinfoModule } from '@adins/ucapprovalgeneralinfo';
import { MouViewAddcollDetailComponent } from './mou-view-addcoll-detail/mou-view-addcoll-detail.component';
import { RefAttrModule } from '../ref-attr/ref-attr.module';
import { ChangeMouViewAddcollDetailComponent } from './change-mou-view-addcoll-detail/change-mou-view-addcoll-detail.component';
import { MouViewAddcollDetailXComponent } from 'app/impl/components/sharing-components/shr-comp-mou/mou-view-addcoll-detail/mou-view-addcoll-detail-x.component';
import { ChangeMouViewAddcollDetailXComponent } from 'app/impl/components/sharing-components/shr-comp-mou/change-mou-view-addcoll-detail/change-mou-view-addcoll-detail-x.component';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule,
        RefAttrModule,
        AdInsSharedModule,
        UcapprovalgeneralinfoModule
    ],
    declarations: [
        MouViewAddcollDetailComponent,
        ChangeMouViewAddcollDetailComponent,
        MouViewAddcollDetailXComponent,
        ChangeMouViewAddcollDetailXComponent
    ],
    exports: [
        MouViewAddcollDetailComponent,
        ChangeMouViewAddcollDetailComponent,
        MouViewAddcollDetailXComponent,
        ChangeMouViewAddcollDetailXComponent
    ]
})
export class ShrCompMouModule { }
