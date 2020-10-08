import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';

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
          path: 'Nap/TestFinData',
          component: FinancialDataComponent,
          data: {
              title: 'Detail'
          }
      },
      {
        path: 'NapDetail',
        component: NapDetailFormComponent,
        data: {
            title: 'NAP Detail'
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
