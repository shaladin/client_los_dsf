import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainDataComponent } from "./main-data.component";
import { Nap1AddComponent } from "./nap-1/nap-1-add/nap-1-add.component";
import { Nap1PagingComponent } from "./nap-1/nap-1-paging/nap-1-paging.component";

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
      },
      {
        path: 'NAP1/Paging',
        component: Nap1PagingComponent,
        data: {
          title: 'Paging'
        }
      },
      {
        path: 'NAP1/Add',
        component: Nap1AddComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'NAP1/Detail',
        component: MainDataComponent,
        data: {
          title: 'MainDataContainer'
        }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainDataRoutingModule { }
