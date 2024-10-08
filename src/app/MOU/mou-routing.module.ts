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
import { MouRequestAddcollXComponent } from 'app/impl/MOU/mou-customer-request/mou-request-addcoll/mou-request-addcoll-x.component';
import { MouCustomerDetailXComponent } from 'app/impl/MOU/mou-customer-request/mou-customer-detail/mou-customer-detail-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { ChangeMouRequestAddcollXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-addcoll/change-mou-request-addcoll-x.component';
import { ChangeMouRequestDetailCustomerXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-detail-customer/change-mou-request-detail-customer-x.component';
import {MouCustomerRequestDetailXComponent} from 'app/impl/MOU/mou-customer-request/mou-customer-request-detail/mou-customer-request-detail-x.component';
import {MouReviewFactoringXComponent} from 'app/impl/MOU/mou-customer/mou-review/mou-review-factoring/mou-review-factoring-x.component';
import {MouApprovalFactoringXComponent} from 'app/impl/MOU/mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring-x.component';
import {MouExecutionDetailXComponent} from 'app/impl/MOU/mou-execution/mou-execution-detail/mou-execution-detail-x.component';
import {ChangeMouRequestDetailXComponent} from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-detail/change-mou-request-detail-x.component';
import {ChangeMouReviewFactoringXComponent} from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-factoring/change-mou-review-factoring-x.component';
import {ChangeMouApprovalFactoringXComponent} from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-factoring/change-mou-approval-factoring-x.component';
import {ChangeMouExecutionDetailXComponent} from 'app/impl/MOU/change-mou/change-mou-execution/change-mou-execution-detail/change-mou-execution-detail-x.component';
import {MouReviewDlfnXComponent} from 'app/impl/MOU/mou-customer/mou-review/mou-review-dlfn/mou-review-dlfn-x.component';
import {MouApprovalGeneralXComponent} from 'app/impl/MOU/mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general-x.component';
import {ChangeMouReviewFinancingXComponent} from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-financing/change-mou-review-financing-x.component';
import {ChangeMouReviewGeneralXComponent} from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-general/change-mou-review-general-x.component';
import {ChangeMouApprovalFinancingXComponent} from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-financing/change-mou-approval-financing-x.component';
import {ChangeMouApprovalGeneralXComponent} from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-general/change-mou-approval-general-x.component';
import {MouReviewGeneralXComponent} from 'app/impl/MOU/mou-customer/mou-review/mou-review-general/mou-review-general-x.component';
import { ChangeMouInquiryXComponent } from 'app/impl/MOU/change-mou/change-mou-inquiry/change-mou-inquiry-x.component';
import { ChangeMouReviewPagingXComponent } from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-paging-x.component';
import { MouExecutionPagingXComponent } from 'app/impl/MOU/mou-execution/mou-execution-paging/mou-execution-paging-x.component';
import { LegalReviewDetailXComponent } from 'app/impl/MOU/legal-review/legal-review-detail/legal-review-detail-x.component';
import { ChangeMouDetailDealerFinancingXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-detail-dealerfinancing/change-mou-detail-dealerfinancing-x.component';
import { ChangeMouDetailFactoringXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-detail-factoring/change-mou-detail-factoring-x.component';
import { MouCancelDetailComponent } from './mou-cancel/mou-cancel-detail/mou-cancel-detail.component';
import { MouCustomerRequestXComponent } from 'app/impl/MOU/mou-customer-request/mou-customer-request-x.component';
import { MouCustomerInquiryXComponent } from 'app/impl/MOU/mou-customer/mou-customer-inquiry/mou-customer-inquiry-x.component';
import { ChangeMouRequestPagingXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-paging/change-mou-request-paging-x.component';
import {ChangeMouApprovalPagingXComponent} from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-paging/change-mou-approval-paging-x.component';
import {MouCustomerApprovalXComponent} from 'app/impl/MOU/mou-customer/mou-customer-approval/mou-customer-approval-x.component';
import { MouCustomerRequestXDsfComponent } from 'app/dsf/impl/MOU/mou-customer-request-x-dsf/mou-customer-request-x-dsf.component';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { MouCustomerDetailXDsfComponent } from 'app/dsf/impl/MOU/mou-customer-detail-x-dsf/mou-customer-detail-x-dsf.component';
import { MouCustomerRequestDetailXDsfComponent } from 'app/dsf/impl/MOU/mou-customer-request-detail-x-dsf/mou-customer-request-detail-x-dsf.component';
import { MouRequestAddcollXDsfComponent } from 'app/dsf/impl/MOU/mou-request-addcoll-x-dsf/mou-request-addcoll-x-dsf.component';
import { MouReviewPagingDsfComponent } from 'app/dsf/impl/MOU/mou-review-paging-dsf/mou-review-paging-dsf.component';
import { MouExecutionDetailXDsfComponent } from 'app/dsf/impl/MOU/mou-execution-detail-x-dsf/mou-execution-detail-x-dsf.component';
import { MouExecutionPagingXDsfComponent } from 'app/dsf/impl/MOU/mou-execution-paging-x-dsf/mou-execution-paging-x-dsf.component';
import { MouReviewFactoringXDsfComponent } from 'app/dsf/impl/MOU/mou-review-factoring-x-dsf/mou-review-factoring-x-dsf.component';
import { MouCustomerApprovalXDsfComponent } from 'app/dsf/impl/MOU/mou-customer-approval-x-dsf/mou-customer-approval-x-dsf.component';
import { MouApprovalFactoringXDsfComponent } from 'app/dsf/impl/MOU/mou-approval-factoring-x-dsf/mou-approval-factoring-x-dsf.component';
import { EditMouCustomerDsfComponent } from 'app/dsf/impl/MOU/edit-mou-customer-dsf/edit-mou-customer-dsf.component';
import { ChangeMouRequestPagingXDsfComponent } from 'app/dsf/impl/MOU/change-mou-request-paging-x-dsf/change-mou-request-paging-x-dsf.component';
import { ChangeMouRequestDetailCustomerXDsfComponent } from 'app/dsf/impl/MOU/change-mou-request-detail-customer-x-dsf/change-mou-request-detail-customer-x-dsf.component';
import { ChangeMouRequestDetailXDsfComponent } from 'app/dsf/impl/MOU/change-mou-request-detail-x-dsf/change-mou-request-detail-x-dsf.component';
import { ChangeMouRequestAddcollXDsfComponent } from 'app/dsf/impl/MOU/change-mou-request-addcoll-x-dsf/change-mou-request-addcoll-x-dsf.component';
import { ChangeMouReviewPagingDsfComponent } from 'app/dsf/impl/MOU/change-mou-review-paging-dsf/change-mou-review-paging-dsf.component';
import { ChangeMouReviewFactoringXDsfComponent } from 'app/dsf/impl/MOU/change-mou-review-factoring-x-dsf/change-mou-review-factoring-x-dsf.component';
import { ChangeMouReturnPagingDsfComponent } from 'app/dsf/impl/MOU/change-mou-return-paging-dsf/change-mou-return-paging-dsf.component';
import { ChangeMouApprovalFactoringXDsfComponent } from 'app/dsf/impl/MOU/change-mou-approval-factoring-x-dsf/change-mou-approval-factoring-x-dsf.component';
import { ChangeMouApprovalPagingXDsfComponent } from 'app/dsf/impl/MOU/change-mou-approval-paging-x-dsf/change-mou-approval-paging-x-dsf.component';
import { MouUnfreezeApvDetailXComponent } from 'app/impl/MOU/mou-unfreeze/mou-unfreeze-apv-detail/mou-unfreeze-apv-detail-x.component';

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
        path: PathConstantX.MOU_REQ_DETAIL_X,
        component: MouCustomerRequestDetailXComponent,
        data: {
          title: 'MOU Customer Request Detail X'
        }
      },
      {
        path: PathConstantDsf.MOU_REQ_DETAIL_X_DSF,
        component: MouCustomerRequestDetailXDsfComponent,
        data: {
          title: 'MOU Customer Request Detail X DSF'
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
        path: PathConstantX.DETAIL_X,
        component: MouCustomerDetailXComponent,
        data: {
          title: 'MOU Customer Detail X'
        }
      },
      {
        path: PathConstantDsf.DETAIL_X,
        component: MouCustomerDetailXDsfComponent,
        data: {
          title: 'MOU Customer Detail X DSF'
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
        path: PathConstantX.MOU_CUST_LEGAL_RVW_DETAIL_X,
        component: LegalReviewDetailXComponent,
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
        path: PathConstantDsf.MOU_CUST_RVW_PAGING_DSF,
        component: MouReviewPagingDsfComponent,
        data: {
          title: 'MOU Review Paging Dsf'
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
        path: PathConstantX.MOU_CUST_RVW_GENERAL_X,
        component: MouReviewGeneralXComponent,
        data: {
          title: 'MOU Review General X'
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
        path: PathConstantX.MOU_CUST_RVW_DFLN_X,
        component: MouReviewDlfnXComponent,
        data: {
          title: 'MOU Review Dealer Financing X'
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
        path: PathConstantX.MOU_CUST_RVW_FCTR_X,
        component: MouReviewFactoringXComponent,
        data: {
          title: 'MOU Review Factoring X'
        }
      },
      {
        path: PathConstantDsf.MOU_CUST_RVW_FCTR_X_DSF,
        component: MouReviewFactoringXDsfComponent,
        data: {
          title: 'MOU Review Factoring X Dsf'
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
        path: PathConstantDsf.MOU_EDIT_CUST_PAGING_DSF,
        component: EditMouCustomerDsfComponent,
        data: {
          title: 'Edit MOU Customer Paging Dsf'
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
        path: PathConstantX.MOU_CUST_APPRV_X,
        component: MouCustomerApprovalXComponent,
        data: {
          title: 'MOU Customer Approval'
        }
      },
      {
        path: PathConstantDsf.MOU_CUST_APPRV_X_DSF,
        component: MouCustomerApprovalXDsfComponent,
        data: {
          title: 'MOU Customer Approval Dsf'
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
        path: PathConstantX.MOU_CUST_APPRV_GENERAL_X,
        component: MouApprovalGeneralXComponent,
        data: {
          title: 'MOU Approval General X'
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
        path: PathConstantX.MOU_CUST_APPRV_FCTR_X,
        component: MouApprovalFactoringXComponent,
        data: {
          title: 'MOU Approval Factoring X'
        }
      },
      {
        path: PathConstantDsf.MOU_CUST_APPRV_FCTR_X_DSF,
        component: MouApprovalFactoringXDsfComponent,
        data: {
          title: 'MOU Approval Factoring X Dsf'
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
        path: PathConstant.MOU_CUST_CANCEL_DETAIL,
        component: MouCancelDetailComponent,
        data: {
          title: "MOU Cancel Detail"
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
        path: PathConstantX.MOU_EXECUTION_DETAIL_X,
        component: MouExecutionDetailXComponent,
        data: {
          title: "Mou Execution Detail X"
        }
      },
      {
        path: PathConstantDsf.MOU_EXECUTION_DETAIL_X_DSF,
        component: MouExecutionDetailXDsfComponent,
        data: {
          title: "Mou Execution Detail X Dsf"
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
        path: PathConstantX.MOU_FREEZE_APV_DETAIL,
        component: MouUnfreezeApvDetailXComponent,
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
        path: PathConstantX.CHANGE_MOU_DETAIL_FCTR_X,
        component: ChangeMouDetailFactoringXComponent,
        data: {
          title: "Change MOU Detail Factoring X"
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
        path: PathConstantX.CHANGE_MOU_DETAIL_DLFN_X,
        component: ChangeMouDetailDealerFinancingXComponent,
        data: {
          title: "Change MOU Detail Dealer Financing X"
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
        path: PathConstantX.CHANGE_MOU_REQ_DETAIL_X,
        component: ChangeMouRequestDetailXComponent,
        data: {
          title: "Change MOU Request Detail X"
        }
      },
      {
        path: PathConstantDsf.CHANGE_MOU_REQ_DETAIL_X_DSF,
        component: ChangeMouRequestDetailXDsfComponent,
        data: {
          title: "Change MOU Request Detail X Dsf"
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
        path: PathConstantX.CHANGE_MOU_REQ_DETAIL_CUST_TYPE_X,
        component: ChangeMouRequestDetailCustomerXComponent,
        data: {
          title: "Change MOU Request Customer Detail X"
        }
      },
      {
        path: PathConstantDsf.CHANGE_MOU_REQ_DETAIL_CUST_TYPE_X_DSF,
        component: ChangeMouRequestDetailCustomerXDsfComponent,
        data: {
          title: "Change MOU Request Customer Detail X Dsf"
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
        path: PathConstantDsf.CHANGE_MOU_REQ_ADD_COLL_X_DSF,
        component: ChangeMouRequestAddcollXComponent,
        data: {
          title: "Change MOU Req Add Collateral X"
        }
      },
      {
        path: PathConstantX.CHANGE_MOU_REQ_ADD_COLL_X,
        component: ChangeMouRequestAddcollXDsfComponent,
        data: {
          title: "Change MOU Req Add Collateral X Dsf"
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
        path: PathConstantX.CHANGE_MOU_EXEC_DETAIL_X,
        component: ChangeMouExecutionDetailXComponent,
        data: {
          title: "Change MOU Execution Detail X"
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
        path: PathConstantDsf.CHANGE_MOU_RVW_PAGING_DSF,
        component: ChangeMouReviewPagingDsfComponent,
        data: {
          title: "Change MOU Review DSF"
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
        path: PathConstantX.CHANGE_MOU_RVW_DETAIL_GEN_X,
        component: ChangeMouReviewGeneralXComponent,
        data: {
          title: "Change MOU Review General X"
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
        path: PathConstantDsf.CHANGE_MOU_RVW_DETAIL_FCTR_X_DSF,
        component: ChangeMouReviewFactoringXDsfComponent,
        data: {
          title: "Change MOU Review Factoring X DSF"
        }
      },
      {
        path: PathConstantX.CHANGE_MOU_RVW_DETAIL_FCTR_X,
        component: ChangeMouReviewFactoringXComponent,
        data: {
          title: "Change MOU Review Factoring X"
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
        path: PathConstantX.CHANGE_MOU_RVW_DETAIL_FIN_X,
        component: ChangeMouReviewFinancingXComponent,
        data: {
          title: "Change MOU Review Financing X"
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
        path: PathConstantX.CHANGE_MOU_APV_PAGING_X,
        component: ChangeMouApprovalPagingXComponent,
        data: {
          title: "Change MOU Approval"
        }
      },
      {
        path: PathConstantDsf.CHANGE_MOU_APV_PAGING_X_DSF,
        component: ChangeMouApprovalPagingXDsfComponent,
        data: {
          title: "Change MOU Approval Dsf"
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
        path: PathConstantX.CHANGE_MOU_APV_DETAIL_FCTR_X,
        component: ChangeMouApprovalFactoringXComponent,
        data: {
          title: "Change MOU Approval Factoring X"
        }
      },
      {
        path: PathConstantDsf.CHANGE_MOU_APV_DETAIL_FCTR_X_DSF,
        component: ChangeMouApprovalFactoringXDsfComponent,
        data: {
          title: "Change MOU Approval Factoring X DSF"
        }
      },
      {
        path: PathConstant.CHANGE_MOU_APV_DETAIL_FIN,
        component: ChangeMouApprovalFinancingComponent,
        data: {
          title: "Change MOU Approval Financing"
        }
      },
      {
        path: PathConstantX.CHANGE_MOU_APV_DETAIL_FIN_X,
        component: ChangeMouApprovalFinancingXComponent,
        data: {
          title: "Change MOU Approval Financing X"
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
        path: PathConstantX.CHANGE_MOU_APV_DETAIL_GEN_X,
        component: ChangeMouApprovalGeneralXComponent,
        data: {
          title: "Change MOU Approval General X"
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
        path: PathConstantDsf.CHANGE_MOU_RTN_PAGING_DSF,
        component: ChangeMouReturnPagingDsfComponent,
        data: {
          title: "Change MOU Return Dsf"
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
      {
        path: PathConstant.MOU_CUST_REQ_ADD_COLL,
        component: MouRequestAddcollComponent,
        data: {
          title: 'MOU Collateral'
        }
      },
      {
        path: PathConstantX.MOU_CUST_REQ_ADD_COLL_X,
        component: MouRequestAddcollXComponent,
        data: {
          title: 'MOU Collateral X'
        }
      },
      {
        path: PathConstantDsf.MOU_CUST_REQ_ADD_COLL_X_DSF,
        component: MouRequestAddcollXDsfComponent,
        data: {
          title: 'MOU Collateral X Dsf'
        }
      },
      {
        path: PathConstantX.MOU_CUST_RVW_FCTR_X,
        component: MouReviewFactoringXComponent,
        data: {
          title: 'MOU Review Factoring X'
        }
      },
      {
        path: PathConstantX.MOU_CUST_APPRV_FCTR_X,
        component: MouApprovalFactoringXComponent,
        data: {
          title: 'MOU Approval Factoring X'
        }
      },
      {
        path: PathConstantX.MOU_CUST_RVW_DFLN_X,
        component: MouReviewDlfnXComponent,
        data: {
          title: 'MOU Review Dealer Financing X'
        }
      },
      {
        path: PathConstantX.CHANGE_MOU_INQUIRY_X,
        component: ChangeMouInquiryXComponent,
        data: {
          title: "Change MOU Inquiry X"
        }
      },
      {
        path: PathConstantX.CHANGE_MOU_RVW_PAGING_X,
        component: ChangeMouReviewPagingXComponent,
        data: {
          title: "Change MOU Review X"
        }
      },
      {
        path: PathConstantX.MOU_EXECUTION_PAGING_X,
        component: MouExecutionPagingXComponent,
        data: {
          title: "Mou Execution Paging"
        }
      },
      {
        path: PathConstantDsf.MOU_EXECUTION_PAGING_X_DSF,
        component: MouExecutionPagingXDsfComponent,
        data: {
          title: "Mou Execution Paging Dsf"
        }
      },
      {
        path: PathConstantX.MOU_REQ_PAGING_X,
        component: MouCustomerRequestXComponent,
        data: {
          title: 'MOU Customer Request Paging'
        }
      },
      {
        path: PathConstantDsf.MOU_REQ_PAGING_X_DSF,
        component: MouCustomerRequestXDsfComponent,
        data: {
          title: 'MOU Customer Request Paging Dsf'
        }
      },
      {
        path: PathConstantX.MOU_CUST_INQUIRY_X,
        component: MouCustomerInquiryXComponent,
        data: {
          title: "MOU Inquiry"
        }
      },
      {
        path: PathConstantX.CHANGE_MOU_REQ_PAGING_X,
        component: ChangeMouRequestPagingXComponent,
        data: {
          title: "Change MOU Request Paging"
        }
      },
      {
        path: PathConstantDsf.CHANGE_MOU_REQ_PAGING_X_DSF,
        component: ChangeMouRequestPagingXDsfComponent,
        data: {
          title: "Change MOU Request Paging Dsf"
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
