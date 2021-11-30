import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdOfferingViewRoutingModule } from './prod-offering-view-routing.module';
import { ProdOfferingViewComponent } from './prod-offering-view.component';
import { UcSubsectionModule } from '@adins/uc-subsection';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { MatTabsModule } from '@angular/material';
import { AdInsSharedModule } from 'app/components/adins-module/adIns-shared.module';

@NgModule({
  declarations: [ProdOfferingViewComponent],
  imports: [
    CommonModule,
    AdInsModule,
    ProdOfferingViewRoutingModule,
    UcSubsectionModule,
    NgbModule,
    MatTabsModule,
    AdInsSharedModule
  ]
})
export class ProdOfferingViewModule { }
