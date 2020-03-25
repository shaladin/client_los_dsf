import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocSignerComponent } from './doc-signer/doc-signer.component';
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouReviewGeneralComponent } from './mou-customer/mou-review/mou-review-general/mou-review-general.component';
import { DocSignerDetailComponent } from './doc-signer/doc-signer-detail/doc-signer-detail.component';

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
        path: 'Cust/ReviewPaging',
        component: MouReviewPagingComponent,
        data: {
          title: 'MOU Review Paging'
        }
      },
      {
        path: 'Cust/ReviewGeneral',
        component: MouReviewGeneralComponent,
        data: {
          title: 'MOU Review General'
        }
      },
      {
        path: 'DocSigner/Detail',
        component: DocSignerDetailComponent,
        data: {
          title: 'Document Signer Detail'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MouRoutingModule { }
