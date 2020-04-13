import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerSelfVerificationComponent } from './verification/customer-self-verification/customer-self-verification.component';
import { LeadVerifComponent } from './lead-verif/lead-verif.component';
import { LeadInputComponent } from './lead-input/lead-input.component';
import { LeadInputCustDataComponent } from './lead-input/lead-input-cust-data/lead-input-cust-data.component';
import { LeadInputPageComponent } from './lead-input/lead-input-page/lead-input-page.component';
import { LeadInputMainInfoComponent } from './lead-input/lead-input-main-info/lead-input-main-info.component';
import { LeadCancelComponent } from './lead-cancel/lead-cancel/lead-cancel.component';
import { LeadCancelConfirmComponent } from './lead-cancel/lead-cancel-confirm/lead-cancel-confirm.component'; 
import { LeadViewComponent } from './lead-view/lead-view.component';
import { FraudVerifPagingComponent } from './fraud-verif/fraud-verif-paging/fraud-verif-paging.component';
import { FraudVerifPageComponent } from './fraud-verif/fraud-verif-page/fraud-verif-page.component';
import { LeadInquiryComponent } from './lead-inquiry/lead-inquiry.component';
import { TeleVerifPagingComponent } from './tele-verif/tele-verif-paging/tele-verif-paging.component';
import { TeleVerifDetailComponent } from './tele-verif/tele-verif-detail/tele-verif-detail.component';
import { LeadInputLeadDataComponent } from './lead-input/lead-input-lead-data/lead-input-lead-data.component';
import { LeadUpdateComponent } from './lead-update/lead-update.component';
import { LeadUpdatePageComponent } from './lead-update/lead-update-page/lead-update-page.component';
import { LeadUpdateMainInfoComponent } from './lead-update/lead-update-main-info/lead-update-main-info.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'SelfVerification',
        component: CustomerSelfVerificationComponent,
        data: {
          title: 'Lead Customer Self Verification'
        }
      },
      {
        path: 'Verif',
        component: LeadVerifComponent,
        data: {
          title: 'Lead Verif Paging'
        }
      },
      {
        path: 'Cancel',
        component: LeadCancelComponent,
        data: {
          title: 'Lead Cancel'
        }
      },
      {
        path: 'ConfirmCancel',
        component: LeadCancelConfirmComponent,
        data: {
          title: 'Lead Cancel Confirm'
        }
      },
      {
        path: 'Lead/Paging',
        component: LeadInputComponent,
        data: {
          title: 'Lead Input Paging'
        }
      },
      {
        path: 'LeadInput/CustData',
        component: LeadInputCustDataComponent,
        data: {
          title: 'Lead Paging'
        }
      },
      {
        path: 'LeadInput/Page',
        component: LeadInputPageComponent,
        data: {
          title: 'Lead Input Page'
        }
      },
      {
        path: 'LeadInput/MainInfo',
        component: LeadInputMainInfoComponent,
        data: {
          title: 'Lead Input Main Info'
        }
      },
      {
        path: 'View',
        component: LeadViewComponent,
        data: {
          title: 'Lead View'
        },
      },
      {
        path: 'FraudVerif/Paging',
        component: FraudVerifPagingComponent,
        data: {
          title: 'Fraud verif paging'
        },
      },
      {
        path: 'FraudVerif/Page',
        component: FraudVerifPageComponent,
        data: {
          title: 'Fraud verif page'
        },
      },
      {
        path: 'LeadInquiry',
        component: LeadInquiryComponent,
        data: {
          title: 'Lead Inquiry'
        }
      },
      {
        path: 'TeleVerif/Paging',
        component: TeleVerifPagingComponent,
        data: {
          title: 'Tele Verif Paging'
        }
      },
      {
        path: 'TeleVerif/Detail',
        component: TeleVerifDetailComponent,
        data: {
          title: 'Tele Verif Detail'
        }
      },
      {
        path: 'LeadInput/LeadData',
        component: LeadInputLeadDataComponent,
        data: {
          title: 'Lead Input Main Info'
        }
      },
      {
        path: 'LeadUpdate/Paging',
        component: LeadUpdateComponent,
        data: {
          title: 'Lead Update Paging'
        }
      },
      {
        path: 'LeadUpdate/Page',
        component: LeadUpdatePageComponent,
        data: {
          title: 'Lead Update Page'
        }
      },
      {
        path: 'LeadUpdate/MainInfo',
        component: LeadUpdateMainInfoComponent,
        data: {
          title: 'Lead Update Main Info'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadRoutingModule { }
