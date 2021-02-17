import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { FinancialDataFctrComponent } from '../sharing-component/input-nap-component/financial-data-fctr/financial-data-fctr.component';
import { NapCustMainDataComponent } from './nap-cust-main-data/nap-cust-main-data.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';
import { PathConstant } from 'app/shared/constant/PathConstant';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.PAGING,
        component: NapPagingComponent,
        data: {
          title: 'New Application Paging'
        }
      },
      {
        path: PathConstant.ADD,
        component: NapAddComponent,
        data: {
          title: 'New Application Add'
        }
      },
      {
        path: PathConstant.DETAIL,
        component: NapAddDetailComponent,
        data: {
          title: 'New Application Add Detail'
        }
      },
      {
        path: PathConstant.TEST_FINANCIAL,
        component: FinancialDataFctrComponent,
        data: {
            title: 'Detail'
        }
      },
      {
        path: PathConstant.NAP1,
        component: NapCustMainDataComponent,
        data: {
            title: 'NAP Cust Main Data'
        }
      },
      {
        path: PathConstant.NAP2,
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
export class InputNapFCTRRoutingModule { }
