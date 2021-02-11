import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';
import { NapCustMainDataComponent } from './nap-cust-main-data/nap-cust-main-data.component';

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
          path: 'NAP1',
          component: NapCustMainDataComponent,
          data: {
              title: 'NAP Cust Main Data'
          }
      },
      {
          path: 'NAP2',
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
export class InputNapROSRoutingModule { }
