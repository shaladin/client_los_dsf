import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsfRoutingModule } from './dsf-routing.module';
import { UcreportModule } from '@adins/ucreport';
import { MorningmonitoringComponent } from './report/factoring/morningmonitoring/morningmonitoring.component';
import { AfternoonmonitoringComponent } from './report/factoring/afternoonmonitoring/afternoonmonitoring.component';
import { CollateralComponent } from './report/factoring/collateral/collateral.component';
import { Reminder1Component } from './report/factoring/reminder1/reminder1.component';
import { Reminder5Component } from './report/factoring/reminder5/reminder5.component';

@NgModule({
  declarations: [MorningmonitoringComponent, AfternoonmonitoringComponent, CollateralComponent, Reminder1Component, Reminder5Component],
  imports: [
    CommonModule,
    DsfRoutingModule,
    UcreportModule
  ]
})
export class DsfModule { }
