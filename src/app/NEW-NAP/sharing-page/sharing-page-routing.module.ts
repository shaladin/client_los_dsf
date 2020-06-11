import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapFromLeadPagingComponent } from './nap-from-lead/paging/nap-from-lead-paging.component';
import { NapFromLeadDetailComponent } from './nap-from-lead/detail/nap-from-lead-detail.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharingPageRoutingModule { }
