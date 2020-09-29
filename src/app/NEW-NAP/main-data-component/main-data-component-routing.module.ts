import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustMainDataComponent } from "./cust-main-data/cust-main-data.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'TestingHalaman',
            component: CustMainDataComponent,
            data: {
              title: 'Testing'
            }
        }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainDataComponentRoutingModule { }
