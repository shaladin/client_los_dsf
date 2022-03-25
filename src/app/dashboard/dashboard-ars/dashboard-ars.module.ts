import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardArsRoutingModule } from './dashboard-ars-routing.module';
import { DashboardArsComponent } from './dashboard-ars.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardArsComponent
  ],
  imports: [
    CommonModule,
    DashboardArsRoutingModule,
    SharedModule
  ]
})
export class DashboardArsModule { }
