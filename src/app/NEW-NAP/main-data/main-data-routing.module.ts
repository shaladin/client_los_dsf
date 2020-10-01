import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainDataComponent } from "./main-data.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'MainDataContainer',
          component: MainDataComponent,
          data: {
            title: 'MainDataContainer'
          }
        }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainDataRoutingModule { }
