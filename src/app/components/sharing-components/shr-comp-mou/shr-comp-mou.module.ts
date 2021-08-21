import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UcSubsectionModule } from '@adins/uc-subsection';
import { UcviewgenericModule } from '@adins/ucviewgeneric';
import { UcgridviewModule } from '@adins/ucgridview';
import { UcapprovalgeneralinfoModule } from '@adins/ucapprovalgeneralinfo';
import { MouViewAddcollDetailComponent } from './mou-view-addcoll-detail/mou-view-addcoll-detail.component';
import { RefAttrModule } from '../ref-attr/ref-attr.module';
import { ChangeMouViewAddcollDetailComponent } from './change-mou-view-addcoll-detail/change-mou-view-addcoll-detail.component';

@NgModule({
    imports: [
        CommonModule,
        UcSubsectionModule,
        UcviewgenericModule,
        UcgridviewModule,
        RefAttrModule,
        UcapprovalgeneralinfoModule
    ],
    declarations: [
        MouViewAddcollDetailComponent,
        ChangeMouViewAddcollDetailComponent
    ],
    exports: [
        MouViewAddcollDetailComponent,
        ChangeMouViewAddcollDetailComponent
    ]
})
export class ShrCompMouModule { }
