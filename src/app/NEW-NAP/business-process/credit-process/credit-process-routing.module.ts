import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhoneVerificationPagingComponent } from './phone-verification/phone-verification-paging/phone-verification-paging.component';
import { CommissionReservedFundPagingComponent } from './commission-reserved-fund/comission-reserved-fund-paging/commission-reserved-fund-paging.component';
import { PhoneVerificationSubjectComponent } from './phone-verification/phone-verification-subject/phone-verification-subject.component';
import { PhoneVerificationSubjectVerifComponent } from './phone-verification/phone-verification-subject-verif/phone-verification-subject-verif.component';
import { PhoneVerificationSubjectViewComponent } from './phone-verification/phone-verification-subject-view/phone-verification-subject-view.component';
import { CreditInquiryComponent } from './credit-inquiry/credit-inquiry.component';
import { CreditReviewComponent } from './credit-review-prototype/credit-review-paging/credit-review-paging.component';
import { CreditReviewDetailPersonalComponent } from './credit-review-prototype/credit-review-detail-personal/credit-review-detail-personal.component';
import { CreditReviewCrDetailComponent } from './credit-review-cr/credit-review-cr-detail/credit-review-cr-detail.component';
import { CreditReviewCrPagingComponent } from './credit-review-cr/credit-review-cr-paging/credit-review-cr-paging.component';
import { CreditApprovalCrPagingComponent } from './credit-approval-cr/credit-approval-cr-paging/credit-approval-cr-paging.component';
import { CreditApprovalCrDetailComponent } from './credit-approval-cr/credit-approval-cr-detail/credit-approval-cr-detail.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { CreditReviewPagingComponent } from './credit-review/credit-review-paging/credit-review-paging.component';
import { CreditReviewMainComponent } from './credit-review/credit-review-main/credit-review-main.component';
import { CreditReviewCfnaPagingComponent } from './credit-review-cfna/credit-review-cfna-paging/credit-review-cfna-paging.component';
import { CreditReviewCfnaDetailComponent } from './credit-review-cfna/credit-review-cfna-detail/credit-review-cfna-detail.component';
import { CreditApprovalPagingComponent } from './credit-approval/credit-approval-paging/credit-approval-paging.component';
import { CreditApprovalDetailComponent } from './credit-approval/credit-approval-detail/credit-approval-detail.component';
import { CreditApprovalCfnaPagingComponent } from './credit-approval-cfna/credit-approval-cfna-paging/credit-approval-cfna-paging.component';
import { CreditApprovalCfnaDetailComponent } from './credit-approval-cfna/credit-approval-cfna-detail/credit-approval-cfna-detail.component';
import { CreditReviewPagingDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-dsf/credit-review-paging-dsf/credit-review-paging-dsf.component';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { CreditReviewCfnaPagingDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-cfna-dsf/credit-review-cfna-paging-dsf/credit-review-cfna-paging-dsf.component';
import { CreditReviewDetailDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-dsf/credit-review-detail-dsf/credit-review-detail-dsf.component';
import { CreditReviewCfnaDetailDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-cfna-dsf/credit-review-cfna-detail-dsf/credit-review-cfna-detail-dsf.component';
import { CreditApprovalDetailDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-dsf/credit-approval-detail-dsf/credit-approval-detail-dsf.component';
import { CreditApprovalPagingDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-dsf/credit-approval-paging-dsf/credit-approval-paging-dsf.component';
import { CreditApprovalCfnaPagingDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-cfna-dsf/credit-approval-cfna-paging-dsf/credit-approval-cfna-paging-dsf.component';
import { CreditApprovalCfnaDetailDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-cfna-dsf/credit-approval-cfna-detail-dsf/credit-approval-cfna-detail-dsf.component';

import { ComissionReservedFundDetailXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/comission-reserved-fund-detail-x/comission-reserved-fund-detail-x.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { ComissionReservedFundPagingXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/commission-reserved-fund/comission-reserved-fund-paging-x/comission-reserved-fund-paging-x.component';
import { SurveyPagingXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/survey/survey-paging-x/survey-paging-x.component';
import { SurveySubjectXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/survey/survey-subject-x/survey-subject-x.component';
import { SurveySubjectVerifXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/survey/survey-subject-verif-x/survey-subject-verif-x.component';
import { SurveySubjectViewXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/survey/survey-subject-view-x/survey-subject-view-x.component';
import { CommissionReservedFundDetailComponent } from './commission-reserved-fund/comission-reserved-fund-detail/commission-reserved-fund-detail.component';
import { CreditReviewCrDetailXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/credit-review-cr/credit-review-cr-detail/credit-review-cr-detail-x.component';
import { CreditReviewCrPagingXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/credit-review-cr/credit-review-cr-paging/credit-review-cr-paging-x.component';
import { CreditApprovalCrDetailXComponent } from 'app/impl/NEW-NAP/business-process/credit-process/credit-approval-cr/credit-approval-cr-detail/credit-approval-cr-detail-x.component';
import { CreditReviewDetailXDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-x-dsf/credit-review-detail-x-dsf/credit-review-detail-x-dsf.component';
import { CreditReviewPagingXDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-review-x-dsf/credit-review-paging-x-dsf/credit-review-paging-x-dsf.component';
import { CreditApprovalDetailXDsfComponent } from 'app/NEW-NAP/DSF/business-process-dsf/credit-process-dsf/credit-approval-x-dsf/credit-approval-detail-x-dsf/credit-approval-detail-x-dsf.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstantX.COMM_RSV_FUND_PAGING,
        component: ComissionReservedFundPagingXComponent,
        data: {
          title: 'Commission Reserved Fund Paging'
        }
      },
      {
        path: PathConstantX.COMM_RSV_FUND_DETAIL,
        component: ComissionReservedFundDetailXComponent,
        data: {
          title: 'Commission Reserved Fund Detail'
        }
      },
      {
        path: PathConstant.COMM_RSV_FUND_PAGING,
        component: CommissionReservedFundPagingComponent,
        data: {
          title: 'Commission Reserved Fund Paging'
        }
      },
      {
        path: PathConstant.COMM_RSV_FUND_DETAIL,
        component: CommissionReservedFundDetailComponent,
        data: {
          title: 'Commission Reserved Fund Detail'
        }
      },
      {
        path: PathConstant.PHN_VRF_PAGING,
        component: PhoneVerificationPagingComponent,
        data: {
          title: 'Phone Verification Paging'
        }
      },
      {
        path: PathConstant.PHN_VRF_SUBJECT,
        component: PhoneVerificationSubjectComponent,
        data: {
          title: 'Phone Verification Subject View'
        }
      },
      {
        path: PathConstant.PHN_VRF_SUBJECT_VIEW,
        component: PhoneVerificationSubjectViewComponent,
        data: {
          title: 'Phone Verification Subject View Detail'
        }
      },
      {
        path: PathConstant.PHN_VRF_SUBJECT_VERIF,
        component: PhoneVerificationSubjectVerifComponent,
        data: {
          title: 'Phone Verification Subject Verif'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_PROTOTYPE_PAGING,
        component: CreditReviewComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_PROTOTYPE_DETAIL,
        component: CreditReviewDetailPersonalComponent,
        data: {
          title: 'Credit Review Detail'
        }
      },
      {
        path: PathConstant.CRD_INQUIRY_PAGING,
        component: CreditInquiryComponent,
        data: {
          title: 'Credit Process Inquiry'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_CR_PAGING,
        component: CreditReviewCrPagingComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_CR_DETAIL,
        component: CreditReviewCrDetailComponent,
        data: {
          title: 'Credit Review Detail'
        }
      },
      {
        path: PathConstantDsf.CRD_REVIEW_DETAIL,
        component: CreditReviewDetailDsfComponent,
        data: {
          title: 'Credit Review Detail Dsf'
        }
      },
      {
        path: PathConstant.CRD_APPRV_CR_PAGING,
        component: CreditApprovalCrPagingComponent,
        data: {
          title: 'Credit Approval Paging'
        }
      },
      {
        path: PathConstantDsf.CRD_APPRV_CR_PAGING,
        component: CreditApprovalPagingDsfComponent,
        data: {
          title: 'Credit Approval Paging Dsf'
        }
      },
      {
        path: PathConstantX.CRD_APPRV_CR_DETAIL,
        component: CreditApprovalCrDetailXComponent,
        data: {
          title: 'Credit Approval Detail'
        }
      },
      {
        path: PathConstantDsf.CRD_APPRV_DETAIL_X,
        component: CreditApprovalDetailXDsfComponent,
        data: {
          title: 'Credit Approval Detail Dsf'
        }
      },
      {
        path: PathConstant.CRD_APPRV_CR_DETAIL,
        component: CreditApprovalCrDetailComponent,
        data: {
          title: 'Credit Approval Paging Dsf'
        }
      },
      {
        path: PathConstant.CRD_APPRV_CR_DETAIL,
        component: CreditApprovalCrDetailComponent,
        data: {
          title: 'Credit Approval Detail'
        }
      },
      {
        path: PathConstantDsf.CRD_APPRV_CR_DETAIL,
        component: CreditApprovalDetailDsfComponent,
        data: {
          title: 'Credit Approval Detail Dsf'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_PAGING,
        component: CreditReviewPagingComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: PathConstantDsf.CRD_REVIEW_PAGING,
        component: CreditReviewPagingDsfComponent,
        data: {
          title: 'Credit Review Paging Dsf'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_MAIN,
        component: CreditReviewMainComponent,
        data: {
          title: 'Credit Review Main'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_CFNA_PAGING,
        component: CreditReviewCfnaPagingComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: PathConstantDsf.CRD_REVIEW_CFNA_PAGING,
        component: CreditReviewCfnaPagingDsfComponent,
        data: {
          title: 'Credit Review Paging Dsf'
        }
      },
      {
        path: PathConstant.CRD_REVIEW_CFNA_MAIN,
        component: CreditReviewCfnaDetailComponent,
        data: {
          title: 'Credit Review Main'
        }
      },
      {
        path: PathConstantDsf.CRD_REVIEW_CFNA_MAIN,
        component: CreditReviewCfnaDetailDsfComponent,
        data: {
          title: 'Credit Review Main Dsf'
        }
      },
      {
        path: PathConstant.CRD_APPRV_PAGING,
        component: CreditApprovalPagingComponent,
        data: {
          title: 'Credit Approval Paging'
        }
      },
      {
        path: PathConstant.CRD_APPRV_DETAIL,
        component: CreditApprovalDetailComponent,
        data: {
          title: 'Credit Approval Detail'
        }
      },
      {
        path: PathConstant.CRD_APPRV_CFNA_PAGING,
        component: CreditApprovalCfnaPagingComponent,
        data: {
          title: 'Credit Approval Paging'
        }
      },
      {
        path: PathConstantDsf.CRD_APPRV_CFNA_PAGING,
        component: CreditApprovalCfnaPagingDsfComponent,
        data: {
          title: 'Credit Approval Paging Dsf'
        }
      },
      {
        path: PathConstant.CRD_APPRV_CFNA_DETAIL,
        component: CreditApprovalCfnaDetailComponent,
        data: {
          title: 'Credit Approval Detail'
        }
      },
      {
        path: PathConstantDsf.CRD_APPRV_CFNA_DETAIL,
        component: CreditApprovalCfnaDetailDsfComponent,
        data: {
          title: 'Credit Approval Detail Dsf'
        }
      },
      {
        path: PathConstantX.CRD_REVIEW_CR_PAGING_X,
        component: CreditReviewCrPagingXComponent,
        data: {
          title: 'Credit Review Paging'
        }
      },
      {
        path: PathConstantDsf.CRD_REVIEW_PAGING_X,
        component: CreditReviewPagingXDsfComponent,
        data: {
          title: 'Credit Review Paging Dsf'
        }
      },
      {
        path: PathConstantX.CRD_REVIEW_CR_DETAIL_X,
        component: CreditReviewCrDetailXComponent,
        data: {
          title: 'Credit Review Detail'
        }
      },
      {
        path: PathConstantDsf.CRD_REVIEW_DETAIL_X,
        component: CreditReviewDetailXDsfComponent,
        data: {
          title: 'Credit Review Detail Dsf'
        }
      },
      {
        path: PathConstantX.SURVEY_VERIF_PAGING,
        component: SurveyPagingXComponent,
        data: {
          title: 'Survey Paging'
        }
      },
      {
        path: PathConstantX.SURVEY_VERIF_SUBJECT,
        component: SurveySubjectXComponent,
        data: {
          title: 'Survey Subject'
        }
      },
      {
        path: PathConstantX.SURVEY_VERIF_SUBJECT_VERIF,
        component: SurveySubjectVerifXComponent,
        data: {
          title: 'Survey Subject Verif'
        }
      },
      {
        path: PathConstantX.SURVEY_VERIF_SUBJECT_VIEW,
        component: SurveySubjectViewXComponent,
        data: {
          title: 'Survey Subject View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditProcessSharingRoutingModule { }
