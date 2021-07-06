import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsfRoutingModule } from './dsf-routing.module';
import { UcreportModule } from '@adins/ucreport';
import { MorningmonitoringComponent } from './report/factoring/morningmonitoring/morningmonitoring.component';
import { AfternoonmonitoringComponent } from './report/factoring/afternoonmonitoring/afternoonmonitoring.component';
import { CollateralComponent } from './report/factoring/collateral/collateral.component';

@NgModule({
  declarations: [MorningmonitoringComponent, AfternoonmonitoringComponent, CollateralComponent],
  imports: [
    CommonModule,
    DsfRoutingModule,
    UcreportModule
  ]
})
export class DsfModule { }
