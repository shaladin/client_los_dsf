import { NgModule } from '@angular/core';
import { OutstandingTcPagingComponent } from './outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component';
import { OutstandingTcDetailComponent } from './outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component';
import { ReturnHandlingPagingComponent } from './return-handling/return-handling-paging/return-handling-paging.component';
import { ReturnHandlingDetailComponent } from './return-handling/return-handling-detail/return-handling-detail.component';
import { PagingComponent } from './app-dup-check/paging/paging.component';
import { ListPersonalComponent } from './app-dup-check/list-personal/list-personal.component';
import { ListCompanyComponent } from './app-dup-check/list-company/list-company.component';
import { ApplicantExistingDataPersonalComponent } from './app-dup-check/applicant-existing-data-personal/applicant-existing-data-personal.component';
import { ApplicantExistingDataCompanyComponent } from './app-dup-check/applicant-existing-data-company/applicant-existing-data-company.component';
import { ReturnHandlingEditAppPagingComponent } from './return-handling/return-handling-edit-app-paging/return-handling-edit-app-paging.component';
import { ReturnHandlingPhoneVerifPagingComponent } from './return-handling/return-handling-phone-verif-paging/return-handling-phone-verif-paging.component';
import { ReturnHandlingSurveyComponent } from './return-handling/return-handling-survey/return-handling-survey.component';
import { ReturnHandlingCollateralPagingComponent } from './return-handling/return-handling-collateral-paging/return-handling-collateral-paging.component';
import { ReturnHandlingCollateralEditComponent } from './return-handling/return-handling-collateral-edit/return-handling-collateral-edit.component';
import { ReturnHandlingCollateralDetailComponent } from './return-handling/return-handling-collateral-detail/return-handling-collateral-detail.component';
import { ReturnHandlingComRsvfundPagingComponent } from './return-handling/return-handling-com-rsvfund-paging/return-handling-com-rsvfund-paging.component';
import { CopyCancelledApplicationComponent } from './copy-cancelled-application/copy-cancelled-application.component';
import { AssetInquiryComponent } from './credit-apv-result-ext/asset-inquiry/asset-inquiry.component';
import { CreditApvResultExtDetailComponent } from './credit-apv-result-ext/credit-apv-result-ext-detail/credit-apv-result-ext-detail.component';
import { CreditApvResultExtPagingComponent } from './credit-apv-result-ext/credit-apv-result-ext-paging/credit-apv-result-ext-paging.component';
import { RouterModule, Routes } from '@angular/router';
import { ReturnHandlingAdditionalTcPagingComponent } from './return-handling/return-handling-additional-tc-paging/return-handling-additional-tc-paging.component';
import { ReturnHandlingAdditionalTcDetailComponent } from './return-handling/return-handling-additional-tc-detail/return-handling-additional-tc-detail.component';
import { DupCheckMdPagingComponent } from './app-dup-check-main-data/dup-check-md-paging/dup-check-md-paging.component';
import { DupCheckMdSubjListComponent } from './app-dup-check-main-data/dup-check-md-subj-list/dup-check-md-subj-list.component';
import { DupCheckMdSubjMatchComponent } from './app-dup-check-main-data/dup-check-md-subj-match/dup-check-md-subj-match.component';
import { ReturnHandlingNewEditAppPagingComponent } from './return-handling/return-handling-new-edit-app-paging/return-handling-new-edit-app-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'CreditApprovalResultExt/Paging',
        component: CreditApvResultExtPagingComponent,
        data: {
          title: 'Credit Approval Result Extension Paging'
        }
      },
      {
        path: 'CreditApprovalResultExt/Detail',
        component: CreditApvResultExtDetailComponent,
        data: {
          title: 'Credit Approval Result Extension Detail'
        }
      },
      {
        path: 'CreditApprovalResultExt/AssetInquiry',
        component: AssetInquiryComponent,
        data: {
          title: 'Credit Approval Result Extension Asset Inquiry'
        }
      },
      {
        path: 'OutstandingTC/Paging',
        component: OutstandingTcPagingComponent,
        data: {
          title: 'Outstanding TC Paging'
        }
      },
      {
        path: 'OutstandingTC/Detail',
        component: OutstandingTcDetailComponent,
        data: {
          title: 'Outstanding TC Paging'
        }
      },
      {
        path: 'ReturnHandling/Paging',
        component: ReturnHandlingPagingComponent,
        data: {
          title: 'Return Handling Paging'
        }
      },
      {
        path: 'ReturnHandling/Detail',
        component: ReturnHandlingDetailComponent,
        data: {
          title: 'Return Handling Detail'
        }
      },
      {
        path: 'ReturnHandling/EditAppPaging',
        component: ReturnHandlingEditAppPagingComponent,
        data: {
          title: 'Return Handling Edit App Paging'
        }
      },
      {
        path: 'ReturnHandling/NAP2',
        component: ReturnHandlingNewEditAppPagingComponent,
        data: {
          title: 'Return Handling Edit NAP2 Paging'
        }
      },
      {
        path: 'AppDupCheck/Paging',
        component: PagingComponent,
        data: {
          title: 'App Duplicate Check'
        }
      },
      {
        path: 'AppDupCheck/Personal',
        component: ListPersonalComponent,
        data: {
          title: 'App Duplicate Check Customer Personal'
        }
      },
      {
        path: 'AppDupCheck/Company',
        component: ListCompanyComponent,
        data: {
          title: 'App Duplicate Check Customer Company'
        }
      },
      {
        path: 'AppDupCheck/ApplicantExistingData/Personal',
        component: ApplicantExistingDataPersonalComponent,
        data: {
          title: 'Applicant Existing Data Personal'
        }
      },
      {
        path: 'AppDupCheck/ApplicantExistingData/Company',
        component: ApplicantExistingDataCompanyComponent,
        data: {
          title: 'Applicant Existing Data Company'
        }
      },
      {
        path: 'ReturnHandlingPhoneVerif/Paging',
        component: ReturnHandlingPhoneVerifPagingComponent,
        data: {
          title: 'Return Handling Phone Verification Paging'
        }
      },
      {
        path: 'ReturnHandling/CommissionReservedFund/Paging',
        component: ReturnHandlingComRsvfundPagingComponent,
        data: {
          title: 'Return Handling Commission Reserverd Fund'
        }
      },
      {
        path: 'ReturnHandling/Survey',
        component: ReturnHandlingSurveyComponent,
        data: {
          title: 'Return Handling Survey'
        }
      },
      {
        path: 'ReturnHandlingCollateral/Paging',
        component: ReturnHandlingCollateralPagingComponent,
        data: {
          title: 'Return Handling Collateral'
        }
      },
      {
        path: 'ReturnHandlingCollateral/Edit',
        component: ReturnHandlingCollateralEditComponent,
        data: {
          title: 'Return Handling Collateral Edit'
        }
      },
      {
        path: 'ReturnHandlingCollateral/Detail',
        component: ReturnHandlingCollateralDetailComponent,
        data: {
          title: 'Return Handling Collateral Detail'
        }
      },
      {
        path: 'CopyCancelledApplication',
        component: CopyCancelledApplicationComponent,
        data: {
          title: 'Copy From Cancelled Application'
        }
      },
      {
        path: 'ReturnHandlingAddTc/Paging',
        component: ReturnHandlingAdditionalTcPagingComponent,
        data: {
          title: 'Return Handling Additional Tc Paging'
        }
      },
      {
        path: 'ReturnHandlingAddTc/Detail',
        component: ReturnHandlingAdditionalTcDetailComponent,
        data: {
          title: 'Return Handling Additional Tc Detail'
        }
      },
      // App Dup Check Main Data
      {
        path: 'AppDupCheckMainData/Paging',
        component: DupCheckMdPagingComponent,
        data: {title: 'App Duplicate Check'}
      },
      {
        path: 'AppDupCheckMainData/SubjList',
        component: DupCheckMdSubjListComponent,
        data: {title: 'App Duplicate Check Subject List'}
      },
      {
        path: 'AppDupCheckMainData/SubjMatch',
        component: DupCheckMdSubjMatchComponent,
        data: {title: 'App Duplicate Check Subject Match'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalProcessSharingRoutingModule { }
