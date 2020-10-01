import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LOSErrorDataMonitoringComponent } from "./los-error-data-monitoring/los-error-data-monitoring.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'LosErrorDataMonitoring',
            component: LOSErrorDataMonitoringComponent,
            data: {
                title: 'Los Error Data Monitoring'
            }
        },
    ]
  }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IntegrationRoutingModule { }
