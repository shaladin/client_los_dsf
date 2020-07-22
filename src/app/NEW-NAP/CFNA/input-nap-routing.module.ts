import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';

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
          title: 'New Application Add'
        }
      },
      // {
      //     path: 'Add/Detail',
      //     component: "",
      //     data: {
      //         title: 'AddDetail'
      //     }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapCFNARoutingModule { }
