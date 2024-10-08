import { NgModule } from '@angular/core';
import { SharingModule } from 'app/shared/sharing.module';
import { ArchwizardModule } from 'angular-archwizard';
import { MouRoutingModule } from './mou-routing.module';
import { DocSignerComponent } from './doc-signer/doc-signer.component';
import { MouCustomerRequestComponent } from './mou-customer-request/mou-customer-request.component';
import { MouCustomerRequestDetailComponent } from './mou-customer-request/mou-customer-request-detail/mou-customer-request-detail.component';
import { MouCustomerDetailComponent } from './mou-customer-request/mou-customer-detail/mou-customer-detail.component';
import { CustomerDocPrintingDetailComponent } from './customer-doc-printing/customer-doc-printing-detail/customer-doc-printing-detail.component';
import { CustomerDocPrintingPagingComponent } from './customer-doc-printing/customer-doc-printing-paging/customer-doc-printing-paging.component';
import { MouReviewPagingComponent } from './mou-customer/mou-review/mou-review-paging/mou-review-paging.component';
import { MouDetailGeneralComponent } from './mou-customer-request/mou-detail-general/mou-detail-general.component';
import { MouDetailFactoringComponent } from './mou-customer-request/mou-detail-factoring/mou-detail-factoring.component';
import { MouCustAssetComponent } from './mou-customer-request/mou-detail-general/mou-cust-asset/mou-cust-asset.component';
import { MouCustAssetDetailComponent } from './mou-customer-request/mou-detail-general/mou-cust-asset/mou-cust-asset-detail/mou-cust-asset-detail.component';
import { MouCustFeeComponent } from './mou-customer-request/mou-cust-fee/mou-cust-fee.component';
import { MouCustFeeDetailComponent } from './mou-customer-request/mou-cust-fee/mou-cust-fee-detail/mou-cust-fee-detail.component';
import { MouCustTcComponent } from './mou-customer-request/mou-cust-tc/mou-cust-tc.component';
import { MouCustListedCustFctrComponent } from './mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr.component';
import { MouCustListedCustFctrDetailComponent } from './mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr-detail/mou-cust-listed-cust-fctr-detail.component';
import { MouRequestAddcollComponent } from './mou-customer-request/mou-request-addcoll/mou-request-addcoll.component';
import { DocSignerDetailComponent } from './doc-signer/doc-signer-detail/doc-signer-detail.component';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { EditMouCustomerComponent } from './mou-customer/edit-mou-customer/edit-mou-customer.component';
import { MouCustomerApprovalComponent } from './mou-customer/mou-customer-approval/mou-customer-approval.component';
import { MouApprovalGeneralComponent } from './mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general.component';
import { MouApprovalFactoringComponent } from './mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring.component';
import { MouReviewFactoringComponent } from './mou-customer/mou-review/mou-review-factoring/mou-review-factoring.component';
import { MouReviewGeneralComponent } from './mou-customer/mou-review/mou-review-general/mou-review-general.component';
import { LegalReviewPagingComponent } from './legal-review/legal-review-paging/legal-review-paging.component';
import { LegalReviewDetailComponent } from './legal-review/legal-review-detail/legal-review-detail.component';
import { MouCustomerInquiryComponent } from './mou-customer/mou-customer-inquiry/mou-customer-inquiry.component';
import { NgxCurrencyModule, CurrencyMaskInputMode } from 'ngx-currency';
import { TestUploadComponent } from './test-upload/test-upload.component';
import { MouCancelComponent } from './mou-cancel/mou-cancel.component';
import { MouOsTcPagingComponent } from './mou-os-tc/mou-os-tc-paging/mou-os-tc-paging.component';
import { MouOsTcDetailComponent } from './mou-os-tc/mou-os-tc-detail/mou-os-tc-detail.component';
import { AdInsModule } from 'app/components/adins-module/adins.module';
import { MatTabsModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MouExecutionPagingComponent } from './mou-execution/mou-execution-paging/mou-execution-paging.component';
import { MouExecutionDetailComponent } from './mou-execution/mou-execution-detail/mou-execution-detail.component';
import { MouCustTabComponent } from './mou-customer-request/mou-cust-tab/mou-cust-tab.component';
import { MouCustPersonalContactInfoComponent } from './mou-customer-request/mou-cust-tab/mou-cust-personal-contact-info/mou-cust-personal-contact-info.component';
import { MouCustPersonalFinancialComponent } from './mou-customer-request/mou-cust-tab/mou-cust-personal-financial/mou-cust-personal-financial.component';
import { MouCustBankAccComponent } from './mou-customer-request/mou-cust-tab/mou-cust-bank-acc/mou-cust-bank-acc.component';
import { MouCustJobDataComponent } from './mou-customer-request/mou-cust-tab/mou-cust-job-data/mou-cust-job-data.component';
import { MouCustSocmedComponent } from './mou-customer-request/mou-cust-tab/mou-cust-socmed/mou-cust-socmed.component';
import { MouCustGrpMbrComponent } from './mou-customer-request/mou-cust-tab/mou-cust-grp-mbr/mou-cust-grp-mbr.component';
import { MouCustPersonalMainComponent } from './mou-customer-request/mou-cust-tab/mou-cust-personal-main/mou-cust-personal-main.component';
import { MatCheckboxModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MouCustCompanyContactInfoComponent } from './mou-customer-request/mou-cust-tab/mou-cust-company-contact-info/mou-cust-company-contact-info.component';
import { MouCustCompanyFinancialComponent } from './mou-customer-request/mou-cust-tab/mou-cust-company-financial/mou-cust-company-financial.component';
import { MouCustCompanyMainComponent } from './mou-customer-request/mou-cust-tab/mou-cust-company-main/mou-cust-company-main.component';
import { MouCustLegalDocComponent } from './mou-customer-request/mou-cust-tab/mou-cust-legal-doc/mou-cust-legal-doc.component';
import { MouCustMgmntShrholderComponent } from './mou-customer-request/mou-cust-tab/mou-cust-mgmnt-shrholder/mou-cust-mgmnt-shrholder.component';
import { SimilarMouPersonalDataComponent } from './mou-dup-check/similar-mou-personal-data/similar-mou-personal-data.component';
import { SimilarMouCompanyDataComponent } from './mou-dup-check/similar-mou-company-data/similar-mou-company-data.component';
import { MouDupCheckPagingComponent } from './mou-dup-check/mou-dup-check-paging/mou-dup-check-paging.component';
import { ExistingMouCompanyComponent } from './mou-dup-check/existing-mou-company/existing-mou-company.component';
import { ExistingMouPersonalComponent } from './mou-dup-check/existing-mou-personal/existing-mou-personal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharingComponentModule } from 'app/shared/sharingcomponent.module';
import { MouViewComponentsModule } from 'app/components/general/mou-view/mou-view.components.module';
import { UcapprovalcreateModule } from '@adins/ucapprovalcreate';
import { UcapprovalR3Module } from '@adins/ucapproval-r3';
import { UcapprovalHistoryModule } from '@adins/ucapproval-history';
import { UcapprovalgeneralinfoModule } from '@adins/ucapprovalgeneralinfo';
import { SharedModule } from 'app/shared/shared.module';
import { MouMainInfoComponent } from './mou-main-info/mou-main-info.component';
import { UnauthorizedPageComponent } from 'app/unauthorized/unauthorized.component';
import { MouReviewDlfnComponent } from './mou-customer/mou-review/mou-review-dlfn/mou-review-dlfn.component';
import { ChangeMouApprovalFactoringComponent } from './change-mou/change-mou-approval/change-mou-approval-factoring/change-mou-approval-factoring.component';
import { ChangeMouApprovalFinancingComponent } from './change-mou/change-mou-approval/change-mou-approval-financing/change-mou-approval-financing.component';
import { ChangeMouApprovalGeneralComponent } from './change-mou/change-mou-approval/change-mou-approval-general/change-mou-approval-general.component';
import { ChangeMouApprovalPagingComponent } from './change-mou/change-mou-approval/change-mou-approval-paging/change-mou-approval-paging.component';
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
import { ChangeMouAddcollComponent } from './change-mou/change-mou-view/change-mou-addcoll/change-mou-addcoll.component';
import { ChangeMouDetailComponent } from './change-mou/change-mou-view/change-mou-detail/change-mou-detail.component';
import { MouDetailFinancingComponent } from './mou-customer-request/mou-detail-financing/mou-detail-financing/mou-detail-financing.component';
import { MouUnfreezeApvDetailComponent } from './mou-unfreeze/mou-unfreeze-apv-detail/mou-unfreeze-apv-detail.component';
import { MouUnfreezeApvPagingComponent } from './mou-unfreeze/mou-unfreeze-apv-paging/mou-unfreeze-apv-paging.component';
import { MouUnfreezePagingComponent } from './mou-unfreeze/mou-unfreeze-paging/mou-unfreeze-paging.component';
import { MouUnfreezeDetailComponent } from './mou-unfreeze/mou-unfreeze-detail/mou-unfreeze-detail.component';
import { MouUnfreezeInquiryComponent } from './mou-unfreeze/mou-unfreeze-inquiry/mou-unfreeze-inquiry.component';
import { MouUnfreezeViewComponent } from './mou-unfreeze/mou-unfreeze-view/mou-unfreeze-view.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewModule } from 'app/view-enhancing/view.module';
import { MouCustomerDetailXComponent } from 'app/impl/MOU/mou-customer-request/mou-customer-detail/mou-customer-detail-x.component';
import { MouRequestAddcollXComponent } from 'app/impl/MOU/mou-customer-request/mou-request-addcoll/mou-request-addcoll-x.component';
import { ChangeMouRequestDetailCustomerXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-detail-customer/change-mou-request-detail-customer-x.component';
import { ChangeMouRequestAddcollXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-addcoll/change-mou-request-addcoll-x.component';
import { MouCustomerRequestDetailXComponent } from 'app/impl/MOU/mou-customer-request/mou-customer-request-detail/mou-customer-request-detail-x.component';
import { MouReviewFactoringXComponent } from 'app/impl/MOU/mou-customer/mou-review/mou-review-factoring/mou-review-factoring-x.component';
import { MouApprovalFactoringXComponent } from 'app/impl/MOU/mou-customer/mou-customer-approval/mou-approval-factoring/mou-approval-factoring-x.component';
import { MouExecutionDetailXComponent } from 'app/impl/MOU/mou-execution/mou-execution-detail/mou-execution-detail-x.component';
import { ChangeMouRequestDetailXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-detail/change-mou-request-detail-x.component';
import { ChangeMouReviewFactoringXComponent } from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-factoring/change-mou-review-factoring-x.component';
import { ChangeMouApprovalFactoringXComponent } from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-factoring/change-mou-approval-factoring-x.component';
import { ChangeMouExecutionDetailXComponent } from 'app/impl/MOU/change-mou/change-mou-execution/change-mou-execution-detail/change-mou-execution-detail-x.component';
import { ChangeMouAddcollXComponent } from 'app/impl/MOU/change-mou/change-mou-view/change-mou-addcoll/change-mou-addcoll-x.component';
import { MouReviewDlfnXComponent } from 'app/impl/MOU/mou-customer/mou-review/mou-review-dlfn/mou-review-dlfn-x.component';
import { MouApprovalGeneralXComponent } from 'app/impl/MOU/mou-customer/mou-customer-approval/mou-approval-general/mou-approval-general-x.component';
import { ChangeMouApprovalFinancingXComponent } from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-financing/change-mou-approval-financing-x.component';
import { ChangeMouReviewFinancingXComponent } from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-financing/change-mou-review-financing-x.component';
import { ChangeMouReviewGeneralXComponent } from 'app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-general/change-mou-review-general-x.component';
import { ChangeMouApprovalGeneralXComponent } from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-general/change-mou-approval-general-x.component';
import { MouReviewGeneralXComponent } from 'app/impl/MOU/mou-customer/mou-review/mou-review-general/mou-review-general-x.component';
import { ChangeMouInquiryXComponent } from "app/impl/MOU/change-mou/change-mou-inquiry/change-mou-inquiry-x.component";
import { ChangeMouDetailXComponent } from "app/impl/MOU/change-mou/change-mou-view/change-mou-detail/change-mou-detail-x.component";
import { ChangeMouReviewPagingXComponent } from "app/impl/MOU/change-mou/change-mou-review/change-mou-review-paging/change-mou-review-paging-x.component";
import { MouExecutionPagingXComponent } from 'app/impl/MOU/mou-execution/mou-execution-paging/mou-execution-paging-x.component';
import { MouViewModule } from '../view-enhancing/mou-view/mou-view.module';
import { ShrCompMouModule } from "app/components/sharing-components/shr-comp-mou/shr-comp-mou.module";
import { MouCustFeeXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-fee/mou-cust-fee-x.component';
import { MouCustListedCustFctrXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr-x.component';
import { MouDetailGeneralXComponent } from 'app/impl/MOU/mou-customer-request/mou-detail-general/mou-detail-general-x.component';
import { MouDetailFactoringXComponent } from 'app/impl/MOU/mou-customer-request/mou-detail-factoring/mou-detail-factoring-x.component';
import { LegalReviewDetailXComponent } from 'app/impl/MOU/legal-review/legal-review-detail/legal-review-detail-x.component';
import { MouDetailFinancingXComponent } from 'app/impl/MOU/mou-customer-request/mou-detail-financing/mou-detail-financing/mou-detail-financing-x.component';
import { ChangeMouDetailDealerFinancingXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-detail-dealerfinancing/change-mou-detail-dealerfinancing-x.component';
import { ChangeMouDetailFactoringXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-detail-factoring/change-mou-detail-factoring-x.component';
import { AdInsSharedModule } from "app/components/adins-module/adIns-shared.module";
import { MouCancelDetailComponent } from './mou-cancel/mou-cancel-detail/mou-cancel-detail.component';
import { MouCustMgmntShrholderPublicComponent } from "app/MOU/mou-customer-request/mou-cust-tab/mou-cust-mgmnt-shrholder/mgmnt-shrholder-public/mou-cust-mgmnt-shrholder-public.component";
import { MouCustTabXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-tab/mou-cust-tab-x.component';
import { MouCustAttrContentComponentComponent } from "./mou-customer-request/mou-cust-tab/mou-cust-attr-content-component/mou-cust-attr-content-component.component";
import { ChangeMouAddcollHistoryComponent } from "./change-mou/change-mou-view/change-mou-addcoll-history/change-mou-addcoll-history.component";
import { ChangeMouDetailHistoryComponent } from "./change-mou/change-mou-view/change-mou-detail-history/change-mou-detail-history.component";
import { ChangeMouHistoryVersionComponent } from "./change-mou/change-mou-view/change-mou-history/change-mou-history.component";
import { MouCustomerRequestXComponent } from 'app/impl/MOU/mou-customer-request/mou-customer-request-x.component';
import { MouCustomerInquiryXComponent } from 'app/impl/MOU/mou-customer/mou-customer-inquiry/mou-customer-inquiry-x.component';
import { ChangeMouRequestPagingXComponent } from 'app/impl/MOU/change-mou/change-mou-request/change-mou-request-paging/change-mou-request-paging-x.component';
import {MouCustomerApprovalXComponent} from 'app/impl/MOU/mou-customer/mou-customer-approval/mou-customer-approval-x.component';
import {ChangeMouApprovalPagingXComponent} from 'app/impl/MOU/change-mou/change-mou-approval/change-mou-approval-paging/change-mou-approval-paging-x.component';
import { UcpagingComponent } from '@adins/ucpaging';
import { ChangeMouHistoryVersionXComponent } from 'app/impl/MOU/change-mou/change-mou-view/change-mou-history/change-mou-history-x.component';
import { ChangeMouViewModule } from 'app/view-enhancing/change-mou-view/change-mou-view.module';
import { ChangeMouAddcollHistoryXComponent } from 'app/impl/MOU/change-mou/change-mou-view/change-mou-addcoll-history/change-mou-addcoll-history-x.component';
import { ChangeMouDetailHistoryXComponent } from 'app/impl/MOU/change-mou/change-mou-view/change-mou-detail-history/change-mou-detail-history-x.component';
import { MouCustomerRequestXDsfComponent } from 'app/dsf/impl/MOU/mou-customer-request-x-dsf/mou-customer-request-x-dsf.component';
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
import { ChangeMouAddcollXDsfComponent } from 'app/dsf/impl/MOU/change-mou-addcoll-x-dsf/change-mou-addcoll-x-dsf.component';
import { ChangeMouReturnPagingDsfComponent } from 'app/dsf/impl/MOU/change-mou-return-paging-dsf/change-mou-return-paging-dsf.component';
import { ChangeMouApprovalFactoringXDsfComponent } from 'app/dsf/impl/MOU/change-mou-approval-factoring-x-dsf/change-mou-approval-factoring-x-dsf.component';
import { ChangeMouApprovalPagingXDsfComponent } from 'app/dsf/impl/MOU/change-mou-approval-paging-x-dsf/change-mou-approval-paging-x-dsf.component';
import { ChangeMouDetailXDsfComponent } from 'app/dsf/impl/MOU/change-mou-detail-x-dsf/change-mou-detail-x-dsf.component';
import { MouUnfreezeApvDetailXComponent } from 'app/impl/MOU/mou-unfreeze/mou-unfreeze-apv-detail/mou-unfreeze-apv-detail-x.component';
import { MouCustCompanyMainXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-tab/mou-cust-company-main/mou-cust-company-main-x.component';
import { MouCustPersonalMainXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-tab/mou-cust-personal-main/mou-cust-personal-main-x.component';
import { MouCustMgmntShrholderXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-tab/mou-cust-mgmnt-shrholder/mou-cust-mgmnt-shrholder-x.component';
import { MouCustMgmntShrholderPublicXComponent } from 'app/impl/MOU/mou-customer-request/mou-cust-tab/mou-cust-mgmnt-shrholder/mgmnt-shrholder-public/mou-cust-mgmnt-shrholder-public-x.component';

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",
  nullable: false,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    NgbModule,
    RouterModule,
    AdInsModule,
    ShrCompMouModule,
    MouRoutingModule,
    SharingModule,
    AdInsSharedModule,
    ArchwizardModule,
    MatTabsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ReactiveFormsModule,
    FormsModule,
    SharingComponentModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MouViewComponentsModule,
    UcapprovalcreateModule,
    UcapprovalR3Module,
    UcapprovalHistoryModule,
    UcapprovalgeneralinfoModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    ChangeMouViewModule,
    ViewModule,
    MouViewModule,
    ChangeMouViewModule
  ],
  declarations: [
    DocSignerComponent,
    MouCustomerRequestComponent,
    MouCustomerRequestDetailComponent,
    MouCustomerDetailComponent,
    CustomerDocPrintingDetailComponent,
    CustomerDocPrintingPagingComponent,
    DocSignerComponent,
    MouReviewPagingComponent,
    MouReviewPagingDsfComponent,
    MouReviewFactoringComponent,
    MouDetailGeneralComponent,
    MouDetailFactoringComponent,
    MouCustAssetComponent,
    MouCustAssetDetailComponent,
    MouCustFeeComponent,
    MouCustFeeDetailComponent,
    MouCustTcComponent,
    MouCustListedCustFctrComponent,
    MouCustListedCustFctrDetailComponent,
    MouRequestAddcollComponent,
    DocSignerDetailComponent,
    EditMouCustomerComponent,
    EditMouCustomerDsfComponent,
    LegalReviewPagingComponent,
    LegalReviewDetailComponent,
    MouCustomerApprovalComponent,
    MouCustomerApprovalXComponent,
    MouCustomerApprovalXDsfComponent,
    MouApprovalGeneralComponent,
    MouApprovalFactoringComponent,
    MouReviewGeneralComponent,
    MouDetailFactoringComponent,
    MouCustomerInquiryComponent,
    MouDetailGeneralComponent,
    MouDetailFactoringComponent,
    MouCustAssetComponent,
    MouCustAssetDetailComponent,
    MouCustAssetComponent,
    MouCustAssetDetailComponent,
    MouDetailGeneralComponent,
    TestUploadComponent,
    MouCancelComponent,
    MouOsTcPagingComponent,
    MouOsTcDetailComponent,
    MouExecutionPagingComponent,
    MouExecutionDetailComponent,
    MouCustTabComponent,
    MouCustPersonalContactInfoComponent,
    MouCustPersonalFinancialComponent,
    MouCustBankAccComponent,
    MouCustJobDataComponent,
    MouCustSocmedComponent,
    MouCustGrpMbrComponent,
    MouCustPersonalMainComponent,
    MouCustPersonalMainXComponent,
    MouCustCompanyContactInfoComponent,
    MouCustCompanyFinancialComponent,
    MouCustCompanyMainComponent,
    MouCustCompanyMainXComponent,
    MouCustLegalDocComponent,
    MouCustMgmntShrholderComponent,
    MouCustMgmntShrholderXComponent,
    MouCustMgmntShrholderPublicComponent,
    MouCustMgmntShrholderPublicXComponent,
    SimilarMouPersonalDataComponent,
    SimilarMouCompanyDataComponent,
    MouDupCheckPagingComponent,
    ExistingMouCompanyComponent,
    ExistingMouPersonalComponent,
    MouMainInfoComponent,
    MouReviewDlfnComponent,
    ChangeMouApprovalFactoringComponent,
    ChangeMouApprovalFinancingComponent,
    ChangeMouApprovalGeneralComponent,
    ChangeMouApprovalPagingComponent,
    ChangeMouApprovalPagingXComponent,
    ChangeMouApprovalPagingXDsfComponent,
    ChangeMouCancelComponent,
    ChangeMouExecutionDetailComponent,
    ChangeMouExecutionPagingComponent,
    ChangeMouInquiryComponent,
    ChangeMouDetailDealerFinancingComponent,
    ChangeMouDetailFactoringComponent,
    ChangeMouCustAssetDetailComponent,
    ChangeMouCustAssetComponent,
    ChangeMouDetailGeneralComponent,
    ChangeMouRequestAddcollComponent,
    ChangeMouRequestDetailComponent,
    ChangeMouRequestDetailCustomerComponent,
    ChangeMouRequestPagingComponent,
    ChangeMouReturnDetailComponent,
    ChangeMouReturnPagingComponent,
    ChangeMouReturnPagingDsfComponent,
    ChangeMouReviewFactoringComponent,
    ChangeMouReviewFinancingComponent,
    ChangeMouReviewGeneralComponent,
    ChangeMouReviewPagingComponent,
    ChangeMouReviewPagingDsfComponent,
    ChangeMouAddcollComponent,
    ChangeMouDetailComponent,
    MouDetailFinancingComponent,
    MouUnfreezeApvDetailComponent,
    MouUnfreezeApvDetailXComponent,
    MouUnfreezeApvPagingComponent,
    MouUnfreezePagingComponent,
    MouUnfreezeDetailComponent,
    MouUnfreezeInquiryComponent,
    MouUnfreezeViewComponent,
    MouCustomerDetailXComponent,
    MouCustomerDetailXDsfComponent,
    MouRequestAddcollXComponent,
    MouRequestAddcollXDsfComponent,
    ChangeMouRequestDetailCustomerXComponent,
    ChangeMouRequestDetailCustomerXDsfComponent,
    ChangeMouRequestAddcollXComponent,
    ChangeMouRequestAddcollXDsfComponent,
    MouCustomerRequestDetailXComponent,
    MouCustomerRequestDetailXDsfComponent,
    MouReviewDlfnXComponent,
    MouReviewFactoringXComponent,
    MouReviewFactoringXDsfComponent,
    MouApprovalGeneralXComponent,
    MouApprovalFactoringXComponent,
    MouApprovalFactoringXDsfComponent,
    MouExecutionDetailXComponent,
    MouExecutionDetailXDsfComponent,
    ChangeMouRequestDetailXComponent,
    ChangeMouRequestDetailXDsfComponent,
    ChangeMouReviewFactoringXComponent,
    ChangeMouReviewFactoringXDsfComponent,
    ChangeMouReviewFinancingXComponent,
    ChangeMouReviewGeneralXComponent,
    ChangeMouApprovalFactoringXComponent,
    ChangeMouApprovalFactoringXDsfComponent,
    ChangeMouApprovalFinancingXComponent,
    ChangeMouApprovalGeneralXComponent,
    ChangeMouExecutionDetailXComponent,
    ChangeMouAddcollXComponent,
    ChangeMouAddcollXDsfComponent,
    MouReviewGeneralXComponent,
    MouReviewDlfnXComponent,
    ChangeMouInquiryXComponent,
    ChangeMouDetailXComponent,
    ChangeMouDetailXDsfComponent,
    ChangeMouReviewPagingXComponent,
    MouExecutionPagingXComponent,
    MouExecutionPagingXDsfComponent,
    MouCustFeeXComponent,
    MouDetailFactoringXComponent,
    MouCustListedCustFctrXComponent,
    MouDetailFinancingXComponent,
    MouDetailFactoringXComponent,
    MouDetailGeneralXComponent,
    LegalReviewDetailXComponent,
    ChangeMouDetailDealerFinancingXComponent,
    ChangeMouDetailFactoringXComponent,
    MouCustTabXComponent,
    MouCancelDetailComponent,
    MouCustAttrContentComponentComponent,
    ChangeMouAddcollHistoryComponent,
    ChangeMouDetailHistoryComponent,
    ChangeMouHistoryVersionComponent,
    MouCustomerRequestXComponent,
    MouCustomerRequestXDsfComponent,
    MouCustomerInquiryXComponent,
    ChangeMouRequestPagingXComponent,
    ChangeMouRequestPagingXDsfComponent,
    ChangeMouHistoryVersionXComponent,
    ChangeMouAddcollHistoryXComponent,
    ChangeMouDetailHistoryXComponent
  ],
  exports: [],
  providers: [NGXToastrService],
  entryComponents: [
    MouCustAssetDetailComponent,
    MouCustFeeDetailComponent,
    MouCustAssetDetailComponent,
    MouCustomerApprovalComponent,
    MouCustomerApprovalXComponent,
    MouCustomerApprovalXDsfComponent,
    MouApprovalGeneralComponent,
    MouApprovalFactoringComponent,
    MouRequestAddcollComponent,
    MouCustListedCustFctrDetailComponent,
    UcpagingComponent
  ]
})

export class MouModule { }
