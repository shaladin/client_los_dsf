import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { FinancialDataFctrComponent } from '../sharing-component/input-nap-component/financial-data-fctr/financial-data-fctr.component';

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
        path: 'Nap/TestFinData',
        component: FinancialDataFctrComponent,
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
export class InputNapFCTRRoutingModule { }
