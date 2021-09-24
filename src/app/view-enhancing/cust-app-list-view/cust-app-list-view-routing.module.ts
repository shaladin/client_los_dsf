import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustAppListViewComponent } from './cust-app-list-view.component';

const routes: Routes = [
  {
      path: '',
      component: CustAppListViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustAppListViewRoutingModule { }
