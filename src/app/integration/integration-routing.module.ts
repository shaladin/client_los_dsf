import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PathConstant } from "app/shared/constant/PathConstant";
import { LOSErrorDataMonitoringComponent } from "./los-error-data-monitoring/los-error-data-monitoring.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: PathConstant.LOS_ERR_DATA_MONITORING,
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
