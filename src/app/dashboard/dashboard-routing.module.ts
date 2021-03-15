import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Dashboard1Component } from "app/dashboard/dashboard1/dashboard1.component";
import { Dashboard2Component } from "app/dashboard/dashboard2/dashboard2.component";
import { DashBoardComponent } from 'app/dashboard/dash-board/dash-board.component';
import { PathConstant } from 'app/shared/constant/PathConstant';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
