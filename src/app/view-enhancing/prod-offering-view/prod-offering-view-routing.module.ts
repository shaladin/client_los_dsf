import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdOfferingViewComponent } from './prod-offering-view.component';

const routes: Routes = [
  {
    path: '',
    component: ProdOfferingViewComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdOfferingViewRoutingModule { }
