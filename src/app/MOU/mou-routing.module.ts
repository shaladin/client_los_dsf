import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocSignerComponent } from './doc-signer/doc-signer.component';
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouReviewGeneralComponent } from './mou-customer/mou-review/mou-review-general/mou-review-general.component';
import { MouReviewFactoringComponent } from './mou-customer/mou-review/mou-review-factoring/mou-review-factoring.component';
import { MouViewComponent } from './mou-customer/mou-view/mou-view.component';

import { MouCustomerApprovalComponent } from './mou-customer/mou-customer-approval/mou-customer-approval.component';
import { MouApprovalGeneralComponent } from './mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general.component';
import { MouApprovalFactoringComponent } from './mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring.component';
import { MouRequestAddcollComponent } from './mou-customer/mou-request/mou-request-addcoll/mou-request-addcoll.component';

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
        path: 'Cust/ReviewFactoring',
        component: MouReviewFactoringComponent,
        data: {
          title: 'MOU Review Factoring'
        }
      },
      {
        path: 'Cust/Paging',
        component: MouViewComponent,
        data: {
          title: 'MOU View Factoring'
        }
      },
      
      {
        path: 'Cust/Approval',
        component: MouCustomerApprovalComponent,
        data: {
          title: 'MOU Customer Approval'
        }
      },
      {
        path: 'Cust/ApprovalGeneral',
        component: MouApprovalGeneralComponent,
        data: {
          title: 'MOU Approval General'
        }
      },
      {
        path: 'Cust/ApprovalFactoring',
        component: MouApprovalFactoringComponent,
        data: {
          title: 'MOU Approval Factoring'
        }
      },
      {
        path: 'Cust/RequestAddColl',
        component: MouRequestAddcollComponent,
        data: {
          title: 'MOU Additional Collateral'
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
