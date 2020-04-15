import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreGoLivePagingComponent } from './pre-go-live/pre-go-live-paging/pre-go-live-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'PreGoLive/Paging',
        component: PreGoLivePagingComponent,
        data: {
          title: 'PreGoLive Paging'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProcessRFN4WRoutingModule { }
