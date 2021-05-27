import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { PefindoViewComponent } from './pefindo-view-component/pefindo-view/pefindo-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.PEFINDO_VIEW,
        component: PefindoViewComponent,
        data: {
          title: 'Pefindo View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PefindoViewRoutingModule { }
