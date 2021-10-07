import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { FinancialDataComponent } from '../sharing-component/input-nap-component/financial-data/financial-data.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';
import { NapCustMainDataComponent } from './nap-cust-main-data/nap-cust-main-data.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { NapDetailFormXComponent } from 'app/impl/NEW-NAP/CF4W/nap-detail-form/nap-detail-form-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { NapCustMainDataXComponent } from 'app/impl/NEW-NAP/CF4W/nap-cust-main-data/nap-cust-main-data-x.component';

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
            },
            {
                path: PathConstant.TEST_FINANCIAL,
                component: FinancialDataComponent,
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
            {
                path: PathConstantX.NAP2_X,
                component: NapDetailFormXComponent,
                data: {
                    title: 'NAP Detail'
                }
            },
            {
                path: PathConstantX.NAP1_X,
                component: NapCustMainDataXComponent,
                data: {
                    title: 'NAP Cust Main Data'
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
