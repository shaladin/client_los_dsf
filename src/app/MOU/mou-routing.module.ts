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
import { MouExecutionPagingComponent } from './mou-execution/mou-execution-paging/mou-execution-paging.component';
import { MouExecutionDetailComponent } from './mou-execution/mou-execution-detail/mou-execution-detail.component';
import { MouDupCheckPagingComponent } from './mou-dup-check/mou-dup-check-paging/mou-dup-check-paging.component';
import { SimilarMouCompanyDataComponent } from './mou-dup-check/similar-mou-company-data/similar-mou-company-data.component';
import { SimilarMouPersonalDataComponent } from './mou-dup-check/similar-mou-personal-data/similar-mou-personal-data.component';
import { ExistingMouPersonalComponent } from './mou-dup-check/existing-mou-personal/existing-mou-personal.component';
import { ExistingMouCompanyComponent } from './mou-dup-check/existing-mou-company/existing-mou-company.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { MouReviewDlfnComponent } from './mou-customer/mou-review/mou-review-dlfn/mou-review-dlfn.component';
import { ChangeMouApprovalFactoringComponent } from './change-mou/change-mou-approval/change-mou-approval-factoring/change-mou-approval-factoring.component';
import { ChangeMouApprovalFinancingComponent } from './change-mou/change-mou-approval/change-mou-approval-financing/change-mou-approval-financing.component';
import { ChangeMouApprovalPagingComponent } from './change-mou/change-mou-approval/change-mou-approval-paging/change-mou-approval-paging.component';
import { ChangeMouApprovalGeneralComponent } from './change-mou/change-mou-approval/change-mou-approval-general/change-mou-approval-general.component';
import { ChangeMouCancelComponent } from './change-mou/change-mou-cancel/change-mou-cancel/change-mou-cancel.component';
import { ChangeMouExecutionDetailComponent } from './change-mou/change-mou-execution/change-mou-execution-detail/change-mou-execution-detail.component';
import { ChangeMouExecutionPagingComponent } from './change-mou/change-mou-execution/change-mou-execution-paging/change-mou-execution-paging.component';
import { ChangeMouInquiryComponent } from './change-mou/change-mou-inquiry/change-mou-inquiry.component';
import { ChangeMouDetailDealerFinancingComponent } from './change-mou/change-mou-request/change-mou-detail-dealerfinancing/change-mou-detail-dealerfinancing.component';
import { ChangeMouDetailFactoringComponent } from './change-mou/change-mou-request/change-mou-detail-factoring/change-mou-detail-factoring.component';
import { ChangeMouCustAssetDetailComponent } from './change-mou/change-mou-request/change-mou-detail-general/change-mou-cust-asset/change-mou-cust-asset-detail/change-mou-cust-asset-detail.component';
import { ChangeMouCustAssetComponent } from './change-mou/change-mou-request/change-mou-detail-general/change-mou-cust-asset/change-mou-cust-asset.component';
import { ChangeMouDetailGeneralComponent } from './change-mou/change-mou-request/change-mou-detail-general/change-mou-detail-general.component';
import { ChangeMouRequestAddcollComponent } from './change-mou/change-mou-request/change-mou-request-addcoll/change-mou-request-addcoll.component';
import { ChangeMouRequestDetailComponent } from './change-mou/change-mou-request/change-mou-request-detail/change-mou-request-detail.component';
import { ChangeMouRequestDetailCustomerComponent } from './change-mou/change-mou-request/change-mou-request-detail-customer/change-mou-request-detail-customer.component';
import { ChangeMouRequestPagingComponent } from './change-mou/change-mou-request/change-mou-request-paging/change-mou-request-paging.component';
import { ChangeMouReturnDetailComponent } from './change-mou/change-mou-return/change-mou-return-detail/change-mou-return-detail.component';
import { ChangeMouReturnPagingComponent } from './change-mou/change-mou-return/change-mou-return-paging/change-mou-return-paging.component';
import { ChangeMouReviewFactoringComponent } from './change-mou/change-mou-review/change-mou-review-paging/change-mou-review-factoring/change-mou-review-factoring.component';
import { ChangeMouReviewFinancingComponent } from './change-mou/change-mou-review/change-mou-review-paging/change-mou-review-financing/change-mou-review-financing.component';
import { ChangeMouReviewGeneralComponent } from './change-mou/change-mou-review/change-mou-review-paging/change-mou-review-general/change-mou-review-general.component';
import { ChangeMouReviewPagingComponent } from './change-mou/change-mou-review/change-mou-review-paging/change-mou-review-paging.component';
import { MouUnfreezeApvDetailComponent } from './mou-unfreeze/mou-unfreeze-apv-detail/mou-unfreeze-apv-detail.component';
import { MouUnfreezeApvPagingComponent } from './mou-unfreeze/mou-unfreeze-apv-paging/mou-unfreeze-apv-paging.component';
import { MouUnfreezeInquiryComponent } from './mou-unfreeze/mou-unfreeze-inquiry/mou-unfreeze-inquiry.component';
import { MouUnfreezeViewComponent } from './mou-unfreeze/mou-unfreeze-view/mou-unfreeze-view.component';
import { MouUnfreezeDetailComponent } from './mou-unfreeze/mou-unfreeze-detail/mou-unfreeze-detail.component';
import { MouUnfreezePagingComponent } from './mou-unfreeze/mou-unfreeze-paging/mou-unfreeze-paging.component';

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
        path: PathConstant.MOU_CUST_RVW_DFLN,
        component: MouReviewDlfnComponent,
        data: {
          title: 'MOU Review Dealer Financing'
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
      },
      {
        path: PathConstant.MOU_FREEZE_PAGING,
        component: MouUnfreezePagingComponent,
        data: {
          title: "Mou Freeze Unfreeze Paging"
        }
      },
      {
        path: PathConstant.MOU_FREEZE_DETAIL,
        component: MouUnfreezeDetailComponent,
        data: {
          title: "Mou Freeze Unfreeze Detail"
        }
      },
      {
        path: PathConstant.MOU_FREEZE_APV_PAGING,
        component: MouUnfreezeApvPagingComponent,
        data: {
          title: "Mou Freeze Unfreeze Approval Paging"
        }
      },
      {
        path: PathConstant.MOU_FREEZE_APV_DETAIL,
        component: MouUnfreezeApvDetailComponent,
        data: {
          title: "Mou Freeze Unfreeze Approval Detail"
        }
      },
      {
        path: PathConstant.MOU_FREEZE_INQUIRY,
        component: MouUnfreezeInquiryComponent,
        data: {
          title: "Mou Freeze Unfreeze Inquiry"
        }
      },
      {
        path: PathConstant.MOU_FREEZE_VIEW,
        component: MouUnfreezeViewComponent,
        data: {
          title: "Mou Freeze Unfreeze View"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_DETAIL_GEN,
        component: ChangeMouDetailGeneralComponent,
        data: {
          title: "Change MOU Detail General"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_DETAIL_FCTR,
        component: ChangeMouDetailFactoringComponent,
        data: {
          title: "Change MOU Detail Factoring"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_DETAIL_DLFN,
        component: ChangeMouDetailDealerFinancingComponent,
        data: {
          title: "Change MOU Detail Dealer Financing"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_REQ_PAGING,
        component: ChangeMouRequestPagingComponent,
        data: {
          title: "Change MOU Request Paging"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_REQ_DETAIL,
        component: ChangeMouRequestDetailComponent,
        data: {
          title: "Change MOU Request Detail"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_REQ_DETAIL_CUST_TYPE,
        component: ChangeMouRequestDetailCustomerComponent,
        data: {
          title: "Change MOU Request Customer Detail"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_CUST_ASSET,
        component: ChangeMouCustAssetComponent,
        data: {
          title: "Change MOU Cust Asset"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_CUST_ASSET_DETAIL,
        component: ChangeMouCustAssetDetailComponent,
        data: {
          title: "Change MOU Cust Asset Detail"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_REQ_ADD_COLL,
        component: ChangeMouRequestAddcollComponent,
        data: {
          title: "Change MOU Req Add Collateral"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_INQUIRY,
        component: ChangeMouInquiryComponent,
        data: {
          title: "Change MOU Inquiry"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_EXEC_PAGING,
        component: ChangeMouExecutionPagingComponent,
        data: {
          title: "Change MOU Execution"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_EXEC_DETAIL,
        component: ChangeMouExecutionDetailComponent,
        data: {
          title: "Change MOU Execution Detail"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_RVW_PAGING,
        component: ChangeMouReviewPagingComponent,
        data: {
          title: "Change MOU Review"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_RVW_DETAIL_GEN,
        component: ChangeMouReviewGeneralComponent,
        data: {
          title: "Change MOU Review General"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_RVW_DETAIL_FCTR,
        component: ChangeMouReviewFactoringComponent,
        data: {
          title: "Change MOU Review Factoring"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_RVW_DETAIL_FIN,
        component: ChangeMouReviewFinancingComponent,
        data: {
          title: "Change MOU Review Financing"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_APV_PAGING,
        component: ChangeMouApprovalPagingComponent,
        data: {
          title: "Change MOU Approval"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_APV_DETAIL_FCTR,
        component: ChangeMouApprovalFactoringComponent,
        data: {
          title: "Change MOU Approval Factoring"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_APV_DETAIL_FIN,
        component: ChangeMouApprovalFinancingComponent,
        data: {
          title: "Change MOU Approval Factoring"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_APV_DETAIL_GEN,
        component: ChangeMouApprovalGeneralComponent,
        data: {
          title: "Change MOU Approval General"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_RTN_PAGING,
        component: ChangeMouReturnPagingComponent,
        data: {
          title: "Change MOU Return"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_RTN_DETAIL,
        component: ChangeMouReturnDetailComponent,
        data: {
          title: "Change MOU Return Detail"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_CANCEL,
        component: ChangeMouCancelComponent,
        data: {
          title: "Change MOU Canel"
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
