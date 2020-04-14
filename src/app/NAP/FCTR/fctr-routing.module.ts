import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './new-application/nap-paging/nap-paging.component';
import { NapAddComponent } from './new-application/nap-add/nap-add.component';
import { NapAddDetailComponent } from './new-application/nap-add-detail/nap-add-detail.component';
import { PreGoLivePagingComponent } from './pre-go-live-paging/pre-go-live-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Paging',
        component: NapPagingComponent,
        data: {
          title: 'New Application Paging'
        }
      },
      {
        path: 'Add',
        component: NapAddComponent,
        data: {
          title: 'New Application Add'
        }
      },
      {
        path: 'Add/Detail',
        component: NapAddDetailComponent,
        data: {
          title: 'New Application Add Detail'
        }
      },
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
export class FCTRRoutingModule { }
