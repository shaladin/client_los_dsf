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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule { }
