import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadInputComponent } from './lead-input/lead-input.component';

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
        path: 'Lead/Paging',
        component : LeadInputComponent,
        data: {
          title : 'Lead Paging'
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
