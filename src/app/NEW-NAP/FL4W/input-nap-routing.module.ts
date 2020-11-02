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

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AdminProcess',
        loadChildren: './admin-process/admin-process.module#AdminProcessFL4WModule'
      },
      {
        path: 'Add',
        component: NapAddComponent,
        data: {
          title: 'Nap Add'
        }
      },
      {
        path: 'Paging',
        component: NapPagingComponent,
        data: {
          title: 'Nap Paging'
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
        path: 'ViewAgrmnt',
        component: ViewAgrmntComponent,
        data: {
          title: 'AddDetail'
        }
      },
      {
        path: 'ViewInsurance',
        component: ViewInsuranceDetailComponent,
        data: {
          title: 'InsuranceDetail'
        }
      },
      {
        path: 'ViewAgrmntFL4W',
        component: ViewAgrmntFl4wComponent,
        data: {
          title: 'AddDetail'
        }
      },
      {
        path: 'ViewDo',
        component: ViewDeliveryOrderMultiAssetComponent,
        data: {
          title: 'View DO'
        }
      },
      {
        path: 'ViewDo/Detail',
        component: ViewDeliveryOrderDetailComponent,
        data: {
          title: 'View DO'
        }
      },
      {
        path: 'ViewDo/DetailAsset',
        component: ViewDeliveryOrderAssetDetailComponent,
        data: {
          title: 'View DO'
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
export class InputNapFL4WRoutingModule { }
