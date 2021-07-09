import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';
import { NapCustMainDataComponent } from './nap-cust-main-data/nap-cust-main-data.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { NapCustMainDataDsfComponent } from '../DSF/CFNA-dsf/nap-cust-main-data-dsf/nap-cust-main-data-dsf.component';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { NapDetailFormDsfComponent } from '../DSF/CFNA-dsf/nap-detail-form-dsf/nap-detail-form-dsf.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
          path: PathConstant.ADD_DETAIL,
          component: NapAddDetailComponent,
          data: {
              title: 'AddDetail'
          }
      },
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
          title: 'New Application Add'
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
        path: PathConstantDsf.NAP1,
        component: NapCustMainDataDsfComponent,
        data: {
            title: 'NAP Cust Main Data Dsf'
        }
      },
      {
        path: PathConstantDsf.NAP2,
        component: NapDetailFormDsfComponent,
        data: {
            title: 'NAP Detail Dsf'
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
