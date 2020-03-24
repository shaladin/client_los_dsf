import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocSignerComponent } from './doc-signer/doc-signer.component';
import { MouCustomerRequestComponent } from './mou-customer-request/mou-customer-request.component';
import { MouCustomerRequestDetailComponent } from './mou-customer-request/mou-customer-request-detail/mou-customer-request-detail.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'DocSigner/Paging',
        component: DocSignerComponent,
        data: {
          title: 'Document Signer Paging'
        }
      },
      {
        path: 'Request/Paging',
        component: MouCustomerRequestComponent,
        data: {
          title: 'MOU Customer Request Paging'
        }
      },
      {
        path: 'Request/Detail',
        component: MouCustomerRequestDetailComponent,
        data: {
          title: 'MOU Customer Request Detail'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MouRoutingComponent { }
