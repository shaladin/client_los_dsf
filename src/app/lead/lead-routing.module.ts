import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadInputComponent } from './lead-input/lead-input.component';
import { LeadInputCustDataComponent } from './lead-input/lead-input-cust-data/lead-input-cust-data.component';
import { LeadInputPageComponent } from './lead-input/lead-input-page/lead-input-page.component';
import { LeadInputMainInfoComponent } from './lead-input/lead-input-main-info/lead-input-main-info.component';

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
      },
      {
        path: 'LeadInput/CustData',
        component : LeadInputCustDataComponent,
        data: {
          title : 'Lead Paging'
        }
      },
      {
        path: 'LeadInput/Page',
        component : LeadInputPageComponent,
        data: {
          title : 'Lead Page'
        }
      },
      {
        path: 'LeadInput/MainInfo',
        component : LeadInputMainInfoComponent,
        data: {
          title : 'Lead Main Info'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule { }
