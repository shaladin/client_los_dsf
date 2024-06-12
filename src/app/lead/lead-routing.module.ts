import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadInputComponent } from './lead-input/lead-input.component';
import { LeadInputCustDataComponent } from './lead-input/lead-input-cust-data/lead-input-cust-data.component';
import { LeadInputPageComponent } from './lead-input/lead-input-page/lead-input-page.component';
import { LeadInputMainInfoComponent } from './lead-input/lead-input-main-info/lead-input-main-info.component';
import { LeadCancelComponent } from './lead-cancel/lead-cancel/lead-cancel.component';
import { LeadCancelConfirmComponent } from './lead-cancel/lead-cancel-confirm/lead-cancel-confirm.component';
import { FraudVerifPagingComponent } from './fraud-verif/fraud-verif-paging/fraud-verif-paging.component';
import { FraudVerifPageComponent } from './fraud-verif/fraud-verif-page/fraud-verif-page.component';
import { LeadInquiryComponent } from './lead-inquiry/lead-inquiry.component';
import { TeleVerifPagingComponent } from './tele-verif/tele-verif-paging/tele-verif-paging.component';
import { TeleVerifDetailComponent } from './tele-verif/tele-verif-detail/tele-verif-detail.component';
import { LeadInputLeadDataComponent } from './lead-input/lead-input-lead-data/lead-input-lead-data.component';
import { LeadUpdateComponent } from './lead-update/lead-update.component';
import { LeadMonitoringComponent } from './lead-monitoring/lead-monitoring.component';
import { LeadMonitoringReviewComponent } from './lead-monitoring-review/lead-monitoring-review.component';
import { LeadMonitoringReviewDetailComponent } from './lead-monitoring-review/lead-monitoring-review-detail/lead-monitoring-review-detail.component';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { PathConstantDsf } from 'app/shared/constant/PathConstantDsf';
import { LeadToBeFollowUpDsfComponent } from './DSF/lead-to-be-follow-up-dsf/lead-to-be-follow-up-dsf.component';
import { GeneratePotentialRoComponent } from './potential-ro/generate-potential-ro/generate-potential-ro.component';
import { RoTelemkOfferPagingComponent } from './potential-ro/ro-telemk-offer-paging/ro-telemk-offer-paging.component';
import { RoTelemkOfferDetailComponent } from './potential-ro/ro-telemk-offer-detail/ro-telemk-offer-detail.component';
import { RoTelemkOfferVerifComponent } from './potential-ro/ro-telemk-offer-detail/ro-telemk-offer-verif.component';
import { RoPotentialInquiryComponent } from './potential-ro/ro-potential-inquiry/ro-potential-inquiry.component';
import { NewLeadInputMainInfoComponent } from './new-lead-input/new-lead-input-main-info/new-lead-input-main-info.component';
import { NewLeadInputComponent } from './new-lead-input/new-lead-input.component';
import { NewLeadInputCustDataComponent } from './new-lead-input/new-lead-input-cust-data/new-lead-input-cust-data.component';
import { NewFraudVerifComponent } from './new-fraud-verif/new-fraud-verif.component';
import { NewFraudVerifDetailComponent } from './new-fraud-verif/new-fraud-verif-detail/new-fraud-verif-detail.component';
import { NewLeadUpdateComponent } from './new-lead-update/new-lead-update.component';
import { RoPotentialViewComponent } from './potential-ro/ro-potential-view/ro-potential-view.component';
import { RoPotentialExecutionComponent } from './potential-ro/ro-potential-execution/ro-potential-execution.component';
import { NewLeadInputPageComponent } from './new-lead-input/new-lead-input-page/new-lead-input-page.component';
import { SimpleLeadMonitoringComponent } from './simple-lead-monitoring/simple-lead-monitoring.component';
import { SimpleLeadMonitoringReviewComponent } from './simple-lead-monitoring-review/simple-lead-monitoring-review.component';
import { SimpleLeadMonitoringReviewDetailComponent } from './simple-lead-monitoring-review/simple-lead-monitoring-review-detail/simple-lead-monitoring-review-detail.component';
import { NewLeadInputPageDsfComponent } from 'app/dsf/lead/new-lead-input/new-lead-input-page-dsf/new-lead-input-page-dsf.component';
import { PathConstantX } from 'app/impl/shared/constant/PathConstantX';
import { NewLeadUpdateDsfComponent } from 'app/dsf/lead/new-lead-update-dsf/new-lead-update-dsf.component';
import { NewLeadInputDsfComponent } from 'app/dsf/lead/new-lead-input/new-lead-input.component';
import { NewLeadInputMainInfoDsfComponent } from 'app/dsf/lead/new-lead-input/new-lead-input-main-info-dsf/new-lead-input-main-info-dsf.component';
import { RoTelemkOfferDetailXComponent } from 'app/impl/lead/potential-ro/ro-telemk-offer-detail/ro-telemk-offer-detail-x.component';
import { RoTelemkOfferVerifXComponent } from 'app/impl/lead/potential-ro/ro-telemk-offer-detail/ro-telemk-offer-verif-x.component';
import {NewLeadInputPageXComponent} from 'app/impl/lead/new-lead-input/new-lead-input-page/new-lead-input-page-x.component';
import { GeneratePotentialRoXComponent } from 'app/impl/lead/potential-ro/generate-potential-ro/generate-potential-ro-x.component';
import { GeneratePotentialRoDsfComponent } from 'app/dsf/lead/potential-ro-dsf/generate-potential-ro-dsf/generate-potential-ro-dsf.component';
import { GeneratePotentialRoMonitoringDsfComponent } from 'app/dsf/lead/potential-ro-dsf/generate-potential-ro-monitoring-dsf/generate-potential-ro-monitoring-dsf.component';
import { RoTelemkOfferPagingDsfComponent } from 'app/dsf/lead/potential-ro-dsf/ro-telemk-offer-paging-dsf/ro-telemk-offer-paging-dsf.component';
import { RoTelemkOfferVerifXDsfComponent } from 'app/dsf/lead/potential-ro-dsf/ro-telemk-offer-verif-x-dsf/ro-telemk-offer-verif-x-dsf.component';
import { RoPotentialViewDsfComponent } from 'app/dsf/lead/potential-ro-dsf/ro-potential-view-dsf/ro-potential-view-dsf.component';
import { SimpleLeadReportDsfComponent } from 'app/dsf/lead/simple-lead-report-dsf/simple-lead-report-dsf.component';
import { LeadInquiryDsfComponent } from 'app/lead/lead-inquiry-dsf/lead-inquiry-dsf.component';
import {NewFraudVerifDsfComponent} from 'app/dsf/lead/new-fraud-verif-dsf/new-fraud-verif-dsf.component';
import {NewFraudVerifDetailDsfComponent} from 'app/dsf/lead/new-fraud-verif-dsf/new-fraud-verif-detail-dsf/new-fraud-verif-detail-dsf.component';
import {LeadCancelDsfComponent} from 'app/dsf/lead/lead-cancel-dsf/lead-cancel-dsf/lead-cancel-dsf.component';
import { LeadCancelConfirmDsfComponent } from 'app/dsf/lead/lead-cancel-dsf/lead-cancel-confirm-dsf/lead-cancel-confirm-dsf.component';
import { NewLeadInputPageXDsfComponent } from 'app/dsf/lead/new-lead-input/new-lead-input-page-x-dsf/new-lead-input-page-x-dsf.component';
import { NewLeadQcDsfComponent } from 'app/dsf/lead/new-lead-qc-dsf/new-lead-qc-dsf.component';
import { NewLeadQcDetailDsfComponent } from 'app/dsf/lead/new-lead-qc-detail-dsf/new-lead-qc-detail-dsf.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.VERIF,
        component: LeadVerifComponent,
        data: {
          title: 'Lead Verif Paging'
        }
      },
      {
        path: PathConstant.CANCEL,
        component: LeadCancelComponent,
        data: {
          title: 'Lead Cancel'
        }
      },
      {
        path: PathConstant.LEAD_CONFIRM_CANCEL,
        component: LeadCancelConfirmComponent,
        data: {
          title: 'Lead Cancel Confirm'
        }
      },
      {
        path: PathConstant.LEAD_PAGING,
        component: LeadInputComponent,
        data: {
          title: 'Lead Input Paging'
        }
      },
      {
        path: PathConstantDsf.NEW_LEAD_TO_BE_FOLLOW_UP_PAGING,
        component: LeadToBeFollowUpDsfComponent,
        data: {
          title: 'New Lead To Be Follow Up Paging Dsf'
        }
      },
      {
        path: PathConstantDsf.NEW_LEAD_TO_BE_FOLLOW_UP_PAGING,
        component: LeadToBeFollowUpDsfComponent,
        data: {
          title: 'New Lead To Be Follow Up Paging Dsf'
        }
      },
      {
        path: PathConstant.LEAD_INPUT_CUST_DATA,
        component: LeadInputCustDataComponent,
        data: {
          title: 'Lead Paging'
        }
      },
      {
        path: PathConstant.LEAD_INPUT_PAGE,
        component: LeadInputPageComponent,
        data: {
          title: 'Lead Input Page'
        }
      },
      {
        path: PathConstant.LEAD_INPUT_MAIN_INFO,
        component: LeadInputMainInfoComponent,
        data: {
          title: 'Lead Input Main Info'
        }
      },
      {
        path: PathConstant.LEAD_FRAUD_VERIF_PAGING,
        component: FraudVerifPagingComponent,
        data: {
          title: 'Fraud verif paging'
        },
      },
      {
        path: PathConstant.LEAD_FRAUD_VERIF_PAGE,
        component: FraudVerifPageComponent,
        data: {
          title: 'Fraud verif page'
        },
      },
      {
        path: PathConstant.LEAD_INQUIRY,
        component: LeadInquiryComponent,
        data: {
          title: 'Lead Inquiry'
        }
      },
      {
        path: PathConstant.LEAD_TELE_VERIF_PAGING,
        component: TeleVerifPagingComponent,
        data: {
          title: 'Tele Verif Paging'
        }
      },
      {
        path: PathConstant.LEAD_TELE_VERIF_DETAIL,
        component: TeleVerifDetailComponent,
        data: {
          title: 'Tele Verif Detail'
        }
      },
      {
        path: PathConstant.LEAD_INPUT_LEAD_DATA,
        component: LeadInputLeadDataComponent,
        data: {
          title: 'Lead Input Main Info'
        }
      },
      {
        path: PathConstant.LEAD_UPDATE_PAGING,
        component: LeadUpdateComponent,
        data: {
          title: 'Lead Update Paging'
        }
      },
      {
        path: 'SimpleLeadUpdate/Paging',
        component: NewLeadUpdateComponent,
        data: {
          title: 'Lead Update Paging'
        }
      },
      {
        path: PathConstant.LEAD_MONITORING,
        component: LeadMonitoringComponent,
        data: {
          title: 'Lead Monitoring'
        }
      },
      {
        path: PathConstant.LEAD_RVW_MONITORING_PAGING,
        component: LeadMonitoringReviewComponent,
        data: {
          title: 'Lead Review Monitoring'
        }
      },
      {
        path: PathConstant.LEAD_RVW_MONITORING_DETAIL,
        component: LeadMonitoringReviewDetailComponent,
        data: {
          title: 'Lead Review Monitoring Detail'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_PAGING,
        component: GeneratePotentialRoComponent,
        data: {
          title: 'Lead Review Monitoring Detail'
        }
      },
      {
        path: PathConstantDsf.POTENTIAL_RO_PAGING,
        component: GeneratePotentialRoDsfComponent,
        data: {
          title: 'Generate Potential RO'
        }
      },
      {
        path: PathConstantDsf.POTENTIAL_RO_MONITORING,
        component: GeneratePotentialRoMonitoringDsfComponent,
        data: {
          title: 'Upload Potential RO'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_TEL_OFFER_PAGING,
        component: RoTelemkOfferPagingComponent,
        data: {
          title: 'RO Telemarketing Offering'
        }
      },
      {
        path: PathConstantDsf.POTENTIAL_RO_TEL_OFFER_PAGING,
        component: RoTelemkOfferPagingDsfComponent,
        data: {
          title: 'RO Telemarketing Offering'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_TEL_OFFER_DETAIL,
        component: RoTelemkOfferDetailXComponent,
        data: {
          title: 'RO Telemarketing Offering Detail'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_TEL_OFFER_VERIF,
        component: RoTelemkOfferVerifXComponent,
        data: {
          title: 'RO Telemarketing Offering Verification'
        }
      },
      {
        path: PathConstantDsf.POTENTIAL_RO_TEL_OFFER_VERIF,
        component: RoTelemkOfferVerifXDsfComponent,
        data: {
          title: 'RO Telemarketing Offering Verification'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_INQUIRY,
        component: RoPotentialInquiryComponent,
        data: {
          title: 'RO Potential Inquiry'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_VIEW,
        component: RoPotentialViewComponent,
        data: {
          title: 'RO Potential View'
        }
      },
      {
        path: PathConstantDsf.POTENTIAL_RO_VIEW,
        component: RoPotentialViewDsfComponent,
        data: {
          title: 'RO Potential View'
        }
      },
      {
        path: PathConstant.POTENTIAL_RO_EXEC,
        component: RoPotentialExecutionComponent,
        data: {
          title: 'RO Potential Execution'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_PAGING,
        component: NewLeadInputComponent,
        data: {
          title: 'Lead Input Paging'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_PAGING,
        component: NewLeadInputDsfComponent,
        data: {
          title: 'Lead Input Paging Dsf'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_DETAIL,
        component: NewLeadInputPageComponent,
        data: {
          title: 'Lead Detail'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_DETAIL,
        component: NewLeadInputPageDsfComponent,
        data: {
          title: 'Lead Detail Dsf'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_DETAIL_QC,
        component: NewLeadQcDetailDsfComponent,
        data: {
          title: 'Lead Detail QC Dsf'
        }
      },
      {
        path: PathConstantX.SIMPLE_LEAD_DETAIL,
        component: NewLeadInputPageXComponent,
        data: {
          title: 'Lead Detail'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_DETAIL_X,
        component: NewLeadInputPageXDsfComponent,
        data: {
          title: 'Lead Detail X Dsf'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_MAIN_INFO,
        component: NewLeadInputMainInfoComponent,
        data: {
          title: 'Lead Input Main Info'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_MAIN_INFO,
        component: NewLeadInputMainInfoDsfComponent,
        data: {
          title: 'Lead Input Main Info'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_MONITORING,
        component: SimpleLeadMonitoringComponent,
        data: {
          title: 'Simple Lead Monitoring'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_RVW_MONITORING_PAGING,
        component: SimpleLeadMonitoringReviewComponent,
        data: {
          title: 'Simple Lead Review Monitoring'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_RVW_MONITORING_DETAIL,
        component: SimpleLeadMonitoringReviewDetailComponent,
        data: {
          title: 'Simple Lead Review Monitoring Detail'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_FRAUD_VERIF_PAGING,
        component: NewFraudVerifComponent,
        data: {
          title: 'Fraud verif paging'
        },
      },
      {
        path: PathConstant.SIMPLE_LEAD_FRAUD_VERIF_DETAIL,
        component: NewFraudVerifDetailComponent,
        data: {
          title: 'Fraud verif detail'
        },
      },
      {
        path: PathConstant.SIMPLE_LEAD_UPD_PAGING,
        component: NewLeadUpdateComponent,
        data: {
          title: 'Lead Update Paging'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_UPD_PAGING,
        component: NewLeadUpdateDsfComponent,
        data: {
          title: 'Lead Update Paging Dsf'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_QC_PAGING,
        component: NewLeadQcDsfComponent,
        data: {
          title: 'Lead QC Paging Dsf'
        }
      },
      {
        path: PathConstant.SIMPLE_LEAD_CANCEL_PAGING,
        component: LeadCancelComponent,
        data: {
          title: 'Simple Lead Cancel'
        }
      },
      {
        path: PathConstantX.POTENTIAL_ROX_PAGING,
        component: GeneratePotentialRoXComponent,
        data: {
          title: 'Potential RO Paging'
        }
      },
      {
        path: PathConstantDsf.PRINT_REPORT_SIMPLE_LEAD,
        component: SimpleLeadReportDsfComponent,
        data: {
          title: 'Simple Lead Report'
        }
      },
      {
        path: PathConstantDsf.LEAD_INQUIRY_DSF,
        component: LeadInquiryDsfComponent,
        data: {
          title: 'Lead Inquiry Dsf'
        }
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_FRAUD_VERIF_PAGING_DSF,
        component: NewFraudVerifDsfComponent,
        data: {
          title: 'Fraud verif paging Dsf'
        },
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_FRAUD_VERIF_DETAIL_DSF,
        component: NewFraudVerifDetailDsfComponent,
        data: {
          title: 'Fraud verif detail Dsf'
        },
      },
      {
        path: PathConstantDsf.SIMPLE_LEAD_CANCEL_PAGING_DSF,
        component: LeadCancelDsfComponent,
        data: {
          title: 'Simple Lead Cancel Dsf'
        }
      },
      {
        path: PathConstantDsf.LEAD_CANCEL_DSF,
        component: LeadCancelDsfComponent,
        data: {
          title: 'Lead Cancel Dsf'
        }
      },
      {
        path: PathConstantDsf.LEAD_CONFIRM_CANCEL_DSF,
        component: LeadCancelConfirmDsfComponent,
        data: {
          title: 'Lead Cancel Confirm Dsf'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule { }
