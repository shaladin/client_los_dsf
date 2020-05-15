import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { ViewAgrmntComponent } from './view-agrmnt/view-agrmnt.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AdminProcess',
        loadChildren: './admin-process/admin-process.module#AdminProcessFL4WModule'
      },
      {
        path: 'Add',
        component: NapAddComponent,
        data: {
          title: 'Nap Add'
        }
      },
      {
        path: 'Paging',
        component: NapPagingComponent,
        data: {
          title: 'Nap Paging'
        }
      },
      {
        path: 'Add/Detail',
        component: NapAddDetailComponent,
        data: {
          title: 'AddDetail'
        }
      },
      {
        path: 'ViewAgrmnt',
        component: ViewAgrmntComponent,
        data: {
          title: 'AddDetail'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapFL4WRoutingModule { }
