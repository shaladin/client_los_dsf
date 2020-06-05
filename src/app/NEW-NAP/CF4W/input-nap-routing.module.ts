import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapFromLeadPagingComponent } from './nap-from-lead/paging/nap-from-lead-paging.component';
import { NapFromLeadDetailComponent } from './nap-from-lead/detail/nap-from-lead-detail.component';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
          path: 'Paging',
          component: NapPagingComponent,
          data: {
              title: 'Paging'
          }
      },
      {
          path: 'Add',
          component: NapAddComponent,
          data: {
              title: 'Add'
          }
      },
      {
          path: 'Add/Detail',
          component: NapAddDetailComponent,
          data: {
              title: 'AddDetail'
          }
      },
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
          path: 'Nap/TestFinData',
          component: FinancialDataComponent,
          data: {
              title: 'Detail'
          }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapCF4WRoutingModule { }
