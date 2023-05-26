import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrdRvwViewComponent } from './crd-rvw-view.component';
import { UcviewgenericComponent, UcviewgenericModule } from '@adins/ucviewgeneric';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';
import { SharedModule } from 'app/shared/shared.module';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { CrdRvwViewRoutingModule } from './crd-rvw-view.routing.modul';
import { ViewAppComponentModule } from 'app/NEW-NAP/sharing-component/view-app-component/view-app-component.module';
import { ViewMainInfoComponentModule } from 'app/NEW-NAP/sharing-component/view-main-info-component/view-main-info-component.module';
import { CreditReviewComponentModule } from 'app/NEW-NAP/sharing-component/credit-review-component/credit-review-component.module';
import { CrdRvwViewXComponent } from 'app/impl/view-enhancing/crd-rvw-view/crd-rvw-view-x.component';

@NgModule({
  declarations: [
    CrdRvwViewComponent,
    CrdRvwViewXComponent
  ],
  imports: [
    CrdRvwViewRoutingModule,
    CommonModule,
    AdInsModule,
    UcviewgenericModule,
    AdInsSharedModule,
    SharedModule,
    UcSubsectionModule,
    ViewAppComponentModule,
    ViewMainInfoComponentModule,
    CreditReviewComponentModule
  ],
  entryComponents: [
    UcviewgenericComponent
  ],
  exports: [
    CrdRvwViewComponent,
    CrdRvwViewXComponent
  ]
})
export class CrdRvwViewModule { }
