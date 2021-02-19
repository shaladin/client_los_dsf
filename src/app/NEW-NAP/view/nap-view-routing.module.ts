import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreementViewContainerComponent } from './agreement-view-container/agreement-view-container.component';
import { ApplicationViewComponent } from './application-view/application-view.component';
import { InvoiceViewComponent } from '../business-process/admin-process/invoice/invoice-view/invoice-view.component';
import { ViewCollateralDataComponent } from '../sharing-component/view-app-component/view-collateral-data/view-collateral-data.component';
import { PurchaseOrderViewComponent } from './purchase-order-view/purchase-order-view.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.APP_VIEW,
        component: ApplicationViewComponent,
        data: {
          title: 'Document'
        }
      },
      {
        path: PathConstant.APP_VIEW_COLL_DATA_VIEW,
        component: ViewCollateralDataComponent,
        data: {
          title: 'Document'
        }
      },
      {
        path: PathConstant.AGRMNT_VIEW,
        component: AgreementViewContainerComponent,
        data: {
          title: 'Agreement View'
        }
      },
      {
        path: PathConstant.PO_VIEW,
        component: PurchaseOrderViewComponent,
        data: {
          title: 'Purchase Order View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NapViewRoutingModule { }
