import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainInfoComponent } from './main-info/main-info.component';
import { AppMainInfoComponent } from './app-main-info/app-main-info.component';
import { AgrMainInfoComponent } from './agr-main-info/agr-main-info.component';
import { AppViewComponent } from './app-view/app-view.component';
import { AgreementViewContainerComponent } from './agr-view/agreement-view-container.component';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { ViewCollateralDataComponent } from './app-view/view-collateral-data/view-collateral-data.component';
import { LeadViewComponent } from './lead-view/lead-view.component';
import { MouViewComponent } from './mou-view/mou-view.component';
import { SurveyViewComponent } from './survey-view-prototype/survey-view.component';
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
          title: 'Agreement View'
        }
      },
      {
        path: 'POView',
        component: PurchaseOrderViewComponent,
        data: {
          title: 'PO View'
        }
      },
      {
        path: 'AppView/CollateralDataView',
        component: ViewCollateralDataComponent,
        data: {
          title: 'Collateral Data View'
        }
      },
      {
        path: 'Lead',
        component: LeadViewComponent,
        data: {
          title: 'Lead View'
        }
      },
      {
        path: 'Mou/CustView',
        component: MouViewComponent,
        data: {
          title: 'Mou View'
        }
      },
      {
        path: 'SurveyView',
        component: SurveyViewComponent,
        data: {
          title: 'Mou View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule { }
