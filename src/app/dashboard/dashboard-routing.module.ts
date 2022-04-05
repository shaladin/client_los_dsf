import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dashboard1Component } from "app/dashboard/dashboard1/dashboard1.component";
import { Dashboard2Component } from "app/dashboard/dashboard2/dashboard2.component";
import { DashBoardComponent } from 'app/dashboard/dash-board/dash-board.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { DashEmptyComponent } from './dash-empty/dash-empty.component';
import { DashboardSupersetComponent } from './dashboard-superset/dashboard-superset.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.DASHBOARD1,
        component: Dashboard1Component,
        data: {
          title: 'Dashboard 1'
        }
      },
      {
        path: PathConstant.DASHBOARD2,
        component: Dashboard2Component,
        data: {
          title: 'Dashboard 2'
        }
      },
      {
        path: PathConstant.DASHBOARD,
        component: DashBoardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: PathConstant.DASHEMPTY,
        component: DashEmptyComponent,
        data: {
          title: 'Dashboard Empty'
        }
      },
      {
        path: PathConstant.DASHBOARD_SUPERSET,
        component: DashboardSupersetComponent,
        data: {
          title: 'Dashboard Superset'
        }
      },
      {
        path: PathConstant.DASHBOARD_ARS,
        loadChildren: './dashboard-ars/dashboard-ars.module#DashboardArsModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
