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
import { PathConstant } from 'app/shared/constant/PathConstant';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.MOU_TEST_UPLOAD,
        component: TestUploadComponent,
        data: {
          title: 'Test Upload'
        }
      },
      {
        path: PathConstant.MOU_DOC_SIGNER_PAGING,
        component: DocSignerComponent,
        data: {
          title: 'Document Signer Paging'
        }
      },
      {
        path: PathConstant.MOU_REQ_PAGING,
        component: MouCustomerRequestComponent,
        data: {
          title: 'MOU Customer Request Paging'
        }
      },
      {
        path: PathConstant.MOU_REQ_DETAIL,
        component: MouCustomerRequestDetailComponent,
        data: {
          title: 'MOU Customer Request Detail'
        }
      },
      {
        path: PathConstant.DETAIL,
        component: MouCustomerDetailComponent,
        data: {
          title: 'MOU Customer Detail'
        }
      },
      {
        path: PathConstant.MOU_CUST_DOC_PAGING,
        component: CustomerDocPrintingPagingComponent,
        data: {
          title: 'MOU Customer Doc Paging'
        }
      },
      {
        path: PathConstant.MOU_CUST_DOC_DETAIL,
        component: CustomerDocPrintingDetailComponent,
        data: {
          title: 'MOU Customer Doc Detail'
        }
      },
      {
        path: PathConstant.MOU_CUST_LEGAL_RVW_PAGING,
        component: LegalReviewPagingComponent,
        data: {
          title: 'MOU Customer Legal Review Paging'
        }
      },
      {
        path: PathConstant.MOU_CUST_LEGAL_RVW_DETAIL,
        component: LegalReviewDetailComponent,
        data: {
          title: 'MOU Customer Legal Review Detail'
        }
      },
      {
        path: PathConstant.MOU_CUST_RVW_PAGING,
        component: MouReviewPagingComponent,
        data: {
          title: 'MOU Review Paging'
        }
      },
      {
        path: PathConstant.MOU_CUST_RVW_GENERAL,
        component: MouReviewGeneralComponent,
        data: {
          title: 'MOU Review General'
        }
      },
      {
        path: PathConstant.MOU_DOC_SIGNER_DETAIL,
        component: DocSignerDetailComponent,
        data: {
          title: 'Document Signer Detail'
        }
      },
      {
        path: PathConstant.MOU_CUST_RVW_FCTR,
        component: MouReviewFactoringComponent,
        data: {
          title: 'MOU Review Factoring'
        }
      },
      {
        path: PathConstant.MOU_EDIT_CUST_PAGING,
        component: EditMouCustomerComponent,
        data: {
          title: 'Edit MOU Customer Paging'
        }
      },
      {
        path: PathConstant.MOU_CUST_APPRV,
        component: MouCustomerApprovalComponent,
        data: {
          title: 'MOU Customer Approval'
        }
      },
      {
        path: PathConstant.MOU_CUST_APPRV_GENERAL,
        component: MouApprovalGeneralComponent,
        data: {
          title: 'MOU Approval General'
        }
      },
      {
        path: PathConstant.MOU_CUST_APPRV_FCTR,
        component: MouApprovalFactoringComponent,
        data: {
          title: 'MOU Approval Factoring'
        }
      },
      {
        path: PathConstant.MOU_CUST_REQ_ADD_COLL,
        component: MouRequestAddcollComponent,
        data: {
          title: 'MOU Collateral'
        }
      },
      {
        path: PathConstant.MOU_CUST_INQUIRY,
        component: MouCustomerInquiryComponent,
        data: {
          title: "MOU Inquiry"
        }
      },
      {
        path: PathConstant.MOU_CUST_CANCEL,
        component: MouCancelComponent,
        data: {
          title: "MOU Cancel"
        }
      },
      {
        path: PathConstant.MOU_CUST_OUTSTANDING_TC_PAGING,
        component: MouOsTcPagingComponent,
        data: {
          title: "MOU Outstanding TC"
        }
      },
      {
        path: PathConstant.MOU_CUST_OUTSTANDING_TC_DETAIL,
        component: MouOsTcDetailComponent,
        data: {
          title: "MOU Outstanding TC"
        }
      },
      {
        path: PathConstant.MOU_UNAUTHORIZED_PAGE,
        component: UnauthorizedPageComponent,
        data: {
          title: "Unauthorized Page"
        }
      },
      {
        path: PathConstant.MOU_EXECUTION_PAGING,
        component: MouExecutionPagingComponent,
        data: {
          title: "Mou Execution Paging"
        }
      },
      {
        path: PathConstant.MOU_EXECUTION_DETAIL,
        component: MouExecutionDetailComponent,
        data: {
          title: "Mou Execution Detail"
        }
      },
      {
        path: PathConstant.MOU_DUP_CHECK_PAGING,
        component: MouDupCheckPagingComponent,
        data: {
          title: "Mou Duplicate Checking Page"
        }
      },
      {
        path: PathConstant.MOU_DUP_CHECK_SIMILAR_COY,
        component: SimilarMouCompanyDataComponent,
        data: {
          title: "Mou Similar Company Data Page"
        }
      },
      {
        path: PathConstant.MOU_DUP_CHECK_SIMILAR_PERSONAL,
        component: SimilarMouPersonalDataComponent,
        data: {
          title: "Mou Similar Personal Data Page"
        }
      },
      {
        path: PathConstant.MOU_DUP_CHECK_EXIST_PERSONAL,
        component: ExistingMouPersonalComponent,
        data: {
          title: "Mou Existing Personal Data Page"
        }
      },
      {
        path: PathConstant.MOU_DUP_CHECK_EXIST_COY,
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
