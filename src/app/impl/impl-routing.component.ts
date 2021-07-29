import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CessieMonitoringComponent } from './cessie/cessie-upload/cessie-monitoring.component';
import { PathConstantX } from './shared/constant/PathConstantX';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: PathConstantX.CESSIE_MONITORING,
            component: CessieMonitoringComponent,
            data: {
              title: 'Cessie Monitoring'
            }
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImplRoutingModule { }
