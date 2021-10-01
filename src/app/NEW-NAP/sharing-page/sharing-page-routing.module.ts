import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NapFromLeadPagingComponent } from './nap-from-lead/paging/nap-from-lead-paging.component';
import { NapFromLeadDetailComponent } from './nap-from-lead/detail/nap-from-lead-detail.component';
import { NapFromMouDetailComponent } from './nap-from-mou/nap-from-mou-detail/nap-from-mou-detail.component';
import { NapFromMouPagingComponent } from './nap-from-mou/nap-from-mou-paging/nap-from-mou-paging.component';
import { Nap1FromLeadPagingComponent } from './nap1-from-lead/nap1-from-lead-paging/nap1-from-lead-paging.component';
import { Nap1FromLeadDetailComponent } from './nap1-from-lead/nap1-from-lead-detail/nap1-from-lead-detail.component';
import { NapFromSimpleLeadComponent } from './nap-from-simple-lead/nap-from-simple-lead.component';
import { NapFromSimpleLeadDetailComponent } from './nap-from-simple-lead/nap-from-simple-lead-detail/nap-from-simple-lead-detail.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { NapFromSimpleLeadDsfComponent } from '../DSF/sharing-page-dsf/nap-from-simple-lead-dsf/nap-from-simple-lead-dsf.component';
import { NapFromSimpleLeadDetailDsfComponent } from '../DSF/sharing-page-dsf/nap-from-simple-lead-detail-dsf/nap-from-simple-lead-detail-dsf.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { NapFromSimpleLeadDetailXComponent } from 'app/impl/NEW-NAP/sharing-page/nap-from-simple-lead/nap-from-simple-lead-detail/nap-from-simple-lead-detail-x.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: PathConstant.NAP_FROM_LEAD_PAGING,
                component: NapFromLeadPagingComponent,
                data: {
                    title: 'Paging'
                }
            },
            {
                path: PathConstant.NAP_FROM_LEAD_DETAIL,
                component: NapFromLeadDetailComponent,
                data: {
                    title: 'Detail'
                }
            },
            {
                path: PathConstant.NAP_FROM_MOU_DETAIL,
                component: NapFromMouDetailComponent,
                data: {
                    title: 'Nap From Mou Detail'
                }
            },
            {
                path: PathConstant.NAP_FROM_MOU_PAGING,
                component: NapFromMouPagingComponent,
                data: {
                    title: 'Nap From Mou Paging'
                }
            },
            {
                path: PathConstant.NAP1_FROM_LEAD_PAGING,
                component: Nap1FromLeadPagingComponent,
                data: {
                    title: 'Nap1 From Lead Paging'
                }
            },
            {
                path: PathConstant.NAP1_FROM_LEAD_DETAIL,
                component: Nap1FromLeadDetailComponent,
                data: {
                    title: 'Nap1 From Lead Detail'
                }
            },
            {
                path: PathConstant.NAP_SIMPLE_LEAD_PAGING,
                component: NapFromSimpleLeadComponent,
                data: {
                    title: 'Paging'
                }
            },
            {
                path: PathConstant.NAP_SIMPLE_LEAD_DETAIL,
                component: NapFromSimpleLeadDetailComponent,
                data: {
                    title: 'Detail'
                }
            },
            {
                path: PathConstantDsf.NAP_SIMPLE_LEAD_PAGING,
                component: NapFromSimpleLeadDsfComponent,
                data: {
                    title: 'Paging Dsf'
                }
            },
            {
                path: PathConstantDsf.NAP_SIMPLE_LEAD_DETAIL,
                component: NapFromSimpleLeadDetailDsfComponent,
                data: {
                    title: 'Detail Dsf'
                }
            },
            {
                path: PathConstantX.NAP_SIMPLE_LEAD_DETAIL_X,
                component: NapFromSimpleLeadDetailXComponent,
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
export class SharingPageRoutingModule { }
