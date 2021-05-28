import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PefindoViewRoutingModule } from './pefindo-view-routing.module';
import { PefindoViewComponent } from './pefindo-view-component/pefindo-view/pefindo-view.component';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { PefindoScoreViewComponent } from './pefindo-score/pefindo-score-view/pefindo-score-view.component';
import { PefindoContractsViewComponent } from './pefindo-contracts/pefindo-contracts-view/pefindo-contracts-view.component';
import { PefindoContractSummaryViewComponent } from './pefindo-contract-summary/pefindo-contract-summary-view/pefindo-contract-summary-view.component';
import { PefindoOtherDataViewComponent } from './pefindo-other-data/pefindo-other-data-view/pefindo-other-data-view.component';
import { PefindoDashboardViewComponent } from './pefindo-dashboard/pefindo-dashboard-view/pefindo-dashboard-view.component';
import { PefindoPersonalInfoViewComponent } from './pefindo-personal-info/pefindo-personal-info-view/pefindo-personal-info-view.component';
import { PefindoPersonalInfoCoyViewComponent } from './pefindo-personal-info/pefindo-personal-info-coy-view/pefindo-personal-info-coy-view.component';


@NgModule({
  declarations: [PefindoViewComponent, PefindoScoreViewComponent, PefindoContractsViewComponent, PefindoContractSummaryViewComponent, PefindoOtherDataViewComponent, PefindoDashboardViewComponent, PefindoPersonalInfoViewComponent, PefindoPersonalInfoCoyViewComponent],
  imports: [
    CommonModule,
    PefindoViewRoutingModule,
    AdInsModule
  ]
})
export class PefindoViewModule { }
