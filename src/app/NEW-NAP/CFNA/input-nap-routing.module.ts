import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //     path: 'Paging',
      //     component: "",
      //     data: {
      //         title: 'Paging'
      //     }
      // },
      // {
      //     path: 'Add',
      //     component: "",
      //     data: {
      //         title: 'Add'
      //     }
      // },
      {
          path: 'Add/Detail',
          component: NapAddDetailComponent,
          data: {
              title: 'AddDetail'
          }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapCFNARoutingModule { }
