import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustAgrmntListViewComponent } from './cust-agrmnt-list-view.component';

const routes: Routes = [
  {
      path: '',
      component: CustAgrmntListViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustAgrmntListViewRoutingModule { }
