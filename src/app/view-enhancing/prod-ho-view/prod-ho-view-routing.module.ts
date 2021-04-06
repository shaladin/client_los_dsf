import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdHoViewComponent } from './prod-ho-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProdHoViewComponent,
        data: {
          title: 'Product HO View'
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdHoViewRoutingModule { }
