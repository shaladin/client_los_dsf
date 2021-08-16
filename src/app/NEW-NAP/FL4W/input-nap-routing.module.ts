import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';
import { NapAddComponent } from './nap-add/nap-add.component';
import { NapPagingComponent } from './nap-paging/nap-paging.component';
import { NapAddDetailComponent } from './nap-add-detail/nap-add-detail.component';
import { ViewAgrmntComponent } from './view-agrmnt/view-agrmnt.component';
import { ViewDeliveryOrderMultiAssetComponent } from './view-agrmnt/view-delivery-order-multi-asset/view-delivery-order-multi-asset.component';
import { ViewDeliveryOrderDetailComponent } from './view-agrmnt/view-delivery-order-multi-asset/view-delivery-order-detail/view-delivery-order-detail.component';
import { ViewDeliveryOrderAssetDetailComponent } from './view-agrmnt/view-delivery-order-multi-asset/view-delivery-order-asset-detail/view-delivery-order-asset-detail.component';
import { ViewAgrmntFl4wComponent } from './view-agrmnt-fl4w/view-agrmnt-fl4w.component';
import { ViewInsuranceDetailComponent } from '../sharing-component/view-agrmnt-component/view-insurance-detail/view-insurance-detail.component';
import { NapCustMainDataComponent } from './nap-cust-main-data/nap-cust-main-data.component';
import { NapDetailFormComponent } from './nap-detail-form/nap-detail-form.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { NapDetailFormXComponent } from 'app/impl/NEW-NAP/FL4W/nap-detail-form-x/nap-detail-form-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.ADD,
        component: NapAddComponent,
        data: {
          title: 'Nap Add'
        }
      },
      {
        path: PathConstant.PAGING,
        component: NapPagingComponent,
        data: {
          title: 'Nap Paging'
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
        path: PathConstant.FL4W_VIEW_AGRMNT,
        component: ViewAgrmntComponent,
        data: {
          title: 'AddDetail'
        }
      },
      {
        path: PathConstant.FL4W_VIEW_INS,
        component: ViewInsuranceDetailComponent,
        data: {
          title: 'InsuranceDetail'
        }
      },
      {
        path: PathConstant.FL4W_VIEW_AGRMNT_FL4W,
        component: ViewAgrmntFl4wComponent,
        data: {
          title: 'AddDetail'
        }
      },
      {
        path: PathConstant.FL4W_VIEW_DO,
        component: ViewDeliveryOrderMultiAssetComponent,
        data: {
          title: 'View DO'
        }
      },
      {
        path: PathConstant.FL4W_VIEW_DO_DETAIL,
        component: ViewDeliveryOrderDetailComponent,
        data: {
          title: 'View DO'
        }
      },
      {
        path: PathConstant.FL4W_VIEW_DO_DETAIL_ASSET,
        component: ViewDeliveryOrderAssetDetailComponent,
        data: {
          title: 'View DO'
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
        path: PathConstantX.NAP2,
        component: NapDetailFormXComponent,
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
export class InputNapFL4WRoutingModule { }
