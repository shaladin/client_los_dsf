import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapFromLeadPagingComponent } from './nap-from-lead/paging/nap-from-lead-paging.component';
import { NapFromLeadDetailComponent } from './nap-from-lead/detail/nap-from-lead-detail.component';
import { NapFromMouDetailComponent } from './nap-from-mou/nap-from-mou-detail/nap-from-mou-detail.component';
import { NapFromMouPagingComponent } from './nap-from-mou/nap-from-mou-paging/nap-from-mou-paging.component';
import { Nap1FromLeadPagingComponent } from './nap1-from-lead/nap1-from-lead-paging/nap1-from-lead-paging.component';
import { Nap1FromLeadDetailComponent } from './nap1-from-lead/nap1-from-lead-detail/nap1-from-lead-detail.component';

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
      },
      {
          path: 'Nap1FromLead/Paging',
          component: Nap1FromLeadPagingComponent,
          data: {
              title: 'Nap1 From Lead Paging'
          }
      },
      {
          path: 'Nap1FromLead/Detail',
          component: Nap1FromLeadDetailComponent,
          data: {
              title: 'Nap1 From Lead Detail'
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
