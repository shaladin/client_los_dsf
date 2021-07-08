import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { AfternoonmonitoringComponent } from './report/factoring/afternoonmonitoring/afternoonmonitoring.component';
import { CollateralComponent } from './report/factoring/collateral/collateral.component';
import { MorningmonitoringComponent } from './report/factoring/morningmonitoring/morningmonitoring.component';
import { Reminder1Component } from './report/factoring/reminder1/reminder1.component';
import { Reminder5Component } from './report/factoring/reminder5/reminder5.component';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_MORNING_MONITORING,
        component: MorningmonitoringComponent,
        data: {
          title: "Report Fact Morning Monitoring"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_AFTERNOON_MONITORING,
        component: AfternoonmonitoringComponent,
        data: {
          title: "Report Fact Afternoon Monitoring"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_COLLATERAL,
        component: CollateralComponent,
        data: {
          title: "Report Fact Collateral"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_REMINDER1,
        component: Reminder1Component,
        data: {
          title: "Report Fact Reminder1"
        }
      }
    ]
  },
  {
    path:'',
    children: [
      {
        path: PathConstantDsf.PRINT_REPORT_FACT_REMINDER5,
        component: Reminder5Component,
        data: {
          title: "Report Fact Reminder5"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsfRoutingModule { }
