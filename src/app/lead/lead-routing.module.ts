import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadPagingComponent } from './lead-paging/lead-paging.component';
import { LeadViewComponent } from './lead-view/lead-view.component';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path: 'Verif',
        component : LeadVerifComponent,
        data: {
          title : 'Verif Paging'
        }
      },
      {
        path: 'Paging',
        component : LeadPagingComponent,
        data: {
          title : 'Lead Paging'
        }
      },
      {
        path: 'View',
        component : LeadViewComponent,
        data: {
          title : 'Lead View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule { }
