import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';
import { PathConstant } from 'app/shared/constant/PathConstant';

const routes: Routes = [
  {
    path: '',
    children: [
      {
          path: PathConstant.PAGING,
          component: NapPagingComponent,
          data: {
              title: 'Paging'
          }
      },
      {
          path: PathConstant.ADD,
          component: NapAddComponent,
          data: {
              title: 'Add'
          }
      },
      {
          path: PathConstant.ADD_DETAIL,
          component: NapAddDetailComponent,
          data: {
              title: 'AddDetail'
          }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapROSRoutingModule { }
