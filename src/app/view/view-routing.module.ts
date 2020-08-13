import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainInfoComponent } from './main-info/main-info.component';
import { AppMainInfoComponent } from './app-main-info/app-main-info.component';
import { AgrMainInfoComponent } from './agr-main-info/agr-main-info.component';
import { AppViewComponent } from './app-view/app-view.component';
import { AgreementViewContainerComponent } from './agr-view/agreement-view-container.component';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { ViewCollateralDataComponent } from './app-view/view-collateral-data/view-collateral-data.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Dummy',
        // component: DocSignerComponent,
        data: {
          title: 'Document'
        }
      },
      {
        path: 'AppMainInfo',
        component: AppMainInfoComponent,
        data: {
          title: 'App Main Info'
        }
      },
      {
        path: 'AgrMainInfo',
        component: AgrMainInfoComponent,
        data: {
          title: 'Agreement Main INfo'
        }
      },
      {
        path: 'AppView',
        component: AppViewComponent,
        data: {
          title: 'Application View'
        }
      },
      {
        path: 'AgrmntView',
        component: AgreementViewContainerComponent,
        data: {
          title: 'Application View'
        }
      },
      {
        path: 'POView',
        component: PurchaseOrderViewComponent,
        data: {
          title: 'Application View'
        }
      },
      {
        path: 'AppView/CollateralDataView',
        component: ViewCollateralDataComponent,
        data: {
          title: 'Document'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule { }
