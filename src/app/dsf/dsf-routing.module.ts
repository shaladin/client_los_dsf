import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { AfternoonmonitoringComponent } from './report/factoring/afternoonmonitoring/afternoonmonitoring.component';
import { MorningmonitoringComponent } from './report/factoring/morningmonitoring/morningmonitoring.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsfRoutingModule { }
