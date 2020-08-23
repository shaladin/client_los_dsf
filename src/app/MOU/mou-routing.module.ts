import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocSignerComponent } from './doc-signer/doc-signer.component';
import { MouCustomerRequestComponent } from './mou-customer-request/mou-customer-request.component';
import { MouCustomerRequestDetailComponent } from './mou-customer-request/mou-customer-request-detail/mou-customer-request-detail.component';
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouReviewGeneralComponent } from './mou-customer/mou-review/mou-review-general/mou-review-general.component';
import { DocSignerDetailComponent } from './doc-signer/doc-signer-detail/doc-signer-detail.component';
import { MouReviewFactoringComponent } from './mou-customer/mou-review/mou-review-factoring/mou-review-factoring.component';
import { EditMouCustomerComponent } from './mou-customer/edit-mou-customer/edit-mou-customer.component';
import { CustomerDocPrintingPagingComponent } from './customer-doc-printing/customer-doc-printing-paging/customer-doc-printing-paging.component';
import { CustomerDocPrintingDetailComponent } from './customer-doc-printing/customer-doc-printing-detail/customer-doc-printing-detail.component';
import { MouViewComponent } from './mou-customer/mou-view/mou-view.component';
import { LegalReviewDetailComponent } from './legal-review/legal-review-detail/legal-review-detail.component';
import { LegalReviewPagingComponent } from './legal-review/legal-review-paging/legal-review-paging.component';
import { MouCustomerApprovalComponent } from './mou-customer/mou-customer-approval/mou-customer-approval.component';
import { MouApprovalGeneralComponent } from './mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general.component';
import { MouApprovalFactoringComponent } from './mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring.component';
import { MouRequestAddcollComponent } from './mou-customer-request/mou-request-addcoll/mou-request-addcoll.component';
import { MouCustomerDetailComponent } from './mou-customer-request/mou-customer-detail/mou-customer-detail.component';
import { MouOsTcPagingComponent } from './mou-os-tc/mou-os-tc-paging/mou-os-tc-paging.component';
import { MouOsTcDetailComponent } from './mou-os-tc/mou-os-tc-detail/mou-os-tc-detail.component';
import { MouCustomerInquiryComponent } from './mou-customer/mou-customer-inquiry/mou-customer-inquiry.component';
import { TestUploadComponent } from './test-upload/test-upload.component';
import { MouCancelComponent } from './mou-cancel/mou-cancel.component';
import { UnauthorizedPageComponent } from './unauthorized-page/unauthorized-page.component';
import { MouExecutionPagingComponent } from './mou-execution/mou-execution-paging/mou-execution-paging.component';
import { MouExecutionDetailComponent } from './mou-execution/mou-execution-detail/mou-execution-detail.component';
import { MouDupCheckPagingComponent } from './mou-dup-check/mou-dup-check-paging/mou-dup-check-paging.component';
import { SimilarMouCompanyDataComponent } from './mou-dup-check/similar-mou-company-data/similar-mou-company-data.component';
import { SimilarMouPersonalDataComponent } from './mou-dup-check/similar-mou-personal-data/similar-mou-personal-data.component';
import { ExistingMouPersonalComponent } from './mou-dup-check/existing-mou-personal/existing-mou-personal.component';
import { ExistingMouCompanyComponent } from './mou-dup-check/existing-mou-company/existing-mou-company.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'TestUpload', 
        component: TestUploadComponent, 
        data: {
          title: 'Test Upload'
        }
      },
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
      },
      {
        path: 'Detail/:MOUType',
        component: MouCustomerDetailComponent,
        data: {
          title: 'MOU Customer Detail'
        }
      },
      {
        path: 'CustomerDoc/Paging',
        component: CustomerDocPrintingPagingComponent,
        data: {
          title: 'MOU Customer Doc Paging'
        }
      },
      {
        path: 'CustomerDoc/Detail',
        component: CustomerDocPrintingDetailComponent,
        data: {
          title: 'MOU Customer Doc Detail'
        }
      },
      {
        path: 'CustomerLegalReview/Paging',
        component: LegalReviewPagingComponent,
        data: {
          title: 'MOU Customer Legal Review Paging'
        }
      },
      {
        path: 'CustomerLegalReview/Detail',
        component: LegalReviewDetailComponent,
        data: {
          title: 'MOU Customer Legal Review Detail'
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
      {
        path: 'Cust/ReviewFactoring',
        component: MouReviewFactoringComponent,
        data: {
          title: 'MOU Review Factoring'
        }
      },
      {
        path: 'EditMouCustomer/Paging',
        component: EditMouCustomerComponent,
        data: {
          title: 'Edit MOU Customer Paging'
        }
      },
      {
        path: 'Cust/View',
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
          title: 'MOU Collateral'
        }
      },
      {
        path: "Cust/Inquiry",
        component: MouCustomerInquiryComponent,
        data: {
          title: "MOU Inquiry"
        }
      },
      {
        path: "Cust/Cancel",
        component: MouCancelComponent,
        data: {
          title: "MOU Cancel"
        }
      },
      {
        path: "Cust/OutstandingTC/Paging",
        component: MouOsTcPagingComponent,
        data: {
          title: "MOU Outstanding TC"
        }
      },
      {
        path: "Cust/OutstandingTC/Detail",
        component: MouOsTcDetailComponent,
        data: {
          title: "MOU Outstanding TC"
        }
      },
      {
        path: "UnauthorizedPage",
        component: UnauthorizedPageComponent,
        data: {
          title: "Unauthorized Page"
        }
      },
      {
        path: "Execution/Paging",
        component: MouExecutionPagingComponent,
        data: {
          title: "Mou Execution Paging"
        }
      },
      {
        path: "Execution/Detail",
        component: MouExecutionDetailComponent,
        data: {
          title: "Mou Execution Detail"
        }
      },
      {
        path: "DuplicateCheck/Paging",
        component: MouDupCheckPagingComponent,
        data: {
          title: "Mou Duplicate Checking Page"
        }
      },
      {
        path: "DuplicateCheck/SimilarCompany",
        component: SimilarMouCompanyDataComponent,
        data: {
          title: "Mou Similar Company Data Page"
        }
      },
      {
        path: "DuplicateCheck/SimilarPersonal",
        component: SimilarMouPersonalDataComponent,
        data: {
          title: "Mou Similar Personal Data Page"
        }
      },
      {
        path: "DuplicateCheck/ExistingPersonal",
        component: ExistingMouPersonalComponent,
        data: {
          title: "Mou Existing Personal Data Page"
        }
      },
      {
        path: "DuplicateCheck/ExistingCompany",
        component: ExistingMouCompanyComponent,
        data: {
          title: "Mou Existing Company Data Page"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MouRoutingModule { }
