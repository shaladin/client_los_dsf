import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AdminProcess',
        loadChildren: './admin-process/admin-process.module#AdminProcessFL4WModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapFL4WRoutingModule { }
