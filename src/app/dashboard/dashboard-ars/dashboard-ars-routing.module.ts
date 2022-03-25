import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { DashboardArsComponent } from './dashboard-ars.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.DASHBOARD_SAO01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard SAO01 - Sales Overall'
        }
      },
      {
        path: PathConstant.DASHBOARD_SAO02,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard SAO02 - Sales Overall'
        }
      },
      {
        path: PathConstant.DASHBOARD_SAO03,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard SAO03 - Sales Overall'
        }
      },
      
      {
        path: PathConstant.DASHBOARD_SAC01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard SAC01 - Sales Marketing'
        }
      },
      {
        path: PathConstant.DASHBOARD_DEA01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard DEA01 - Dealer Area Performance'
        }
      },
      {
        path: PathConstant.DASHBOARD_DEB01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard DEB01 - Dealer Branch Performance'
        }
      },
      {
        path: PathConstant.DASHBOARD_DAR01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard DAR01 - Daily Report'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN01 - Vintage 30 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN02,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN02 - Vintage 60 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN03,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN03 - Vintage 90 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN04,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN04 - Vintage 120 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN05,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN05 - Vintage 210 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN06,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN06 - Vintage 30 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN07,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN07 - Vintage 60 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN08,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN08 - Vintage 90 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN09,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN09 - Vintage 120 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN10,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN10 - Vintage 210 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN11,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN11 - Vintage 30 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN12,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN12 - Vintage 60 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN13,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN13 - Vintage 90 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN14,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN14 - Vintage 120 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_VIN15,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard VIN15 - Vintage 210 - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_AGM01,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard AGM01 - Agreement Move Roll Rate Analysis - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_AGM02,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard AGM02 - Agreement Move Overall Analysis - Last 6 Months'
        }
      },
      {
        path: PathConstant.DASHBOARD_AGM03,
        component: DashboardArsComponent,
        data: {
          title: 'Dashboard AGM03 - Agreement Move Bucket Analysis - Last 6 Months'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardArsRoutingModule { }
