import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';  
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';

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
      } 
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapFL4WRoutingModule { }
