import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadCancelComponent } from './lead-cancel/lead-cancel/lead-cancel.component';
import { LeadCancelConfirmComponent } from './lead-cancel/lead-cancel-confirm/lead-cancel-confirm.component';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path: 'Verif',
        component : LeadVerifComponent,
        data: {
          title : 'Lead Verif Paging'
        }
      },
      {
        path: 'Cancel',
        component : LeadCancelComponent,
        data: {
          title : 'Lead Cancel'
        }
      },
      {
        path: 'ConfirmCancel',
        component : LeadCancelConfirmComponent,
        data: {
          title : 'Lead Cancel Confirm'
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
