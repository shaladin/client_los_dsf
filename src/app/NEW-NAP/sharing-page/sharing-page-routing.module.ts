import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapFromLeadPagingComponent } from './nap-from-lead/paging/nap-from-lead-paging.component';
import { NapFromLeadDetailComponent } from './nap-from-lead/detail/nap-from-lead-detail.component';
import { NapFromMouDetailComponent } from './nap-from-mou/nap-from-mou-detail/nap-from-mou-detail.component';
import { NapFromMouPagingComponent } from './nap-from-mou/nap-from-mou-paging/nap-from-mou-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
          path: 'NapFromLead/Paging',
          component: NapFromLeadPagingComponent,
          data: {
              title: 'Paging'
          }
      },
      {
          path: 'NapFromLead/Detail',
          component: NapFromLeadDetailComponent,
          data: {
              title: 'Detail'
          }
      },
      {
          path: 'NapFromMou/Detail',
          component: NapFromMouDetailComponent,
          data: {
              title: 'Nap From Mou Detail'
          }
      },
      {
          path: 'NapFromMou/Paging',
          component: NapFromMouPagingComponent,
          data: {
              title: 'Nap From Mou Paging'
          }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharingPageRoutingModule { }
