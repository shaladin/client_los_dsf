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
import { PathConstant } from 'app/shared/constant/PathConstant';
import { ReturnHandlingEditNap4Component } from './return-handling/return-handling-edit-nap4/return-handling-edit-nap4.component';
import { ReturnHandlingNewEditAppPagingComponent } from './return-handling/return-handling-new-edit-app-paging/return-handling-new-edit-app-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.CRD_APPRVL_RES_EXT_PAGING,
        component: CreditApvResultExtPagingComponent,
        data: {
          title: 'Credit Approval Result Extension Paging'
        }
      },
      {
        path: PathConstant.CRD_APPRVL_RES_EXT_DETAIL,
        component: CreditApvResultExtDetailComponent,
        data: {
          title: 'Credit Approval Result Extension Detail'
        }
      },
      {
        path: PathConstant.CRD_APPRVL_RES_EXT_ASSET_INQUIRY,
        component: AssetInquiryComponent,
        data: {
          title: 'Credit Approval Result Extension Asset Inquiry'
        }
      },
      {
        path: PathConstant.OUTSTANDING_TC_PAGING,
        component: OutstandingTcPagingComponent,
        data: {
          title: 'Outstanding TC Paging'
        }
      },
      {
        path: PathConstant.OUTSTANDING_TC_DETAIL,
        component: OutstandingTcDetailComponent,
        data: {
          title: 'Outstanding TC Paging'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_PAGING,
        component: ReturnHandlingPagingComponent,
        data: {
          title: 'Return Handling Paging'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_DETAIL,
        component: ReturnHandlingDetailComponent,
        data: {
          title: 'Return Handling Detail'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_EDIT_APP_PAGING,
        component: ReturnHandlingEditAppPagingComponent,
        data: {
          title: 'Return Handling Edit App Paging'
        }
      },
      {
        path: PathConstant.APP_DUP_CHECK_PAGING,
        component: PagingComponent,
        data: {
          title: 'App Duplicate Check'
        }
      },
      {
        path: 'ReturnHandling/NAP4',
        component: ReturnHandlingEditNap4Component,
        data: {
          title: 'Return Handling Edit NAP 4'
        },
      },
      {
        path: 'ReturnHandling/NAP2',
        component: ReturnHandlingNewEditAppPagingComponent,
        data: {
          title: 'Return Handling Edit NAP2 Paging'
        },
      },
      {
        path: PathConstant.APP_DUP_CHECK_PERSONAL,
        component: ListPersonalComponent,
        data: {
          title: 'App Duplicate Check Customer Personal'
        }
      },
      {
        path: PathConstant.APP_DUP_CHECK_COY,
        component: ListCompanyComponent,
        data: {
          title: 'App Duplicate Check Customer Company'
        }
      },
      {
        path: PathConstant.APP_DUP_CHECK_APP_EXIST_DATA_PERSONAL,
        component: ApplicantExistingDataPersonalComponent,
        data: {
          title: 'Applicant Existing Data Personal'
        }
      },
      {
        path: PathConstant.APP_DUP_CHECK_APP_EXIST_DATA_COY,
        component: ApplicantExistingDataCompanyComponent,
        data: {
          title: 'Applicant Existing Data Company'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_PHN_VRF_PAGING,
        component: ReturnHandlingPhoneVerifPagingComponent,
        data: {
          title: 'Return Handling Phone Verification Paging'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_COMM_RSV_FUND_PAGING,
        component: ReturnHandlingComRsvfundPagingComponent,
        data: {
          title: 'Return Handling Commission Reserverd Fund'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_SRVY,
        component: ReturnHandlingSurveyComponent,
        data: {
          title: 'Return Handling Survey'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_COLL_PAGING,
        component: ReturnHandlingCollateralPagingComponent,
        data: {
          title: 'Return Handling Collateral'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_COLL_EDIT,
        component: ReturnHandlingCollateralEditComponent,
        data: {
          title: 'Return Handling Collateral Edit'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_COLL_DETAIL,
        component: ReturnHandlingCollateralDetailComponent,
        data: {
          title: 'Return Handling Collateral Detail'
        }
      },
      {
        path: PathConstant.COPY_CANCEL_APP,
        component: CopyCancelledApplicationComponent,
        data: {
          title: 'Copy From Cancelled Application'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_ADD_TC_PAGING,
        component: ReturnHandlingAdditionalTcPagingComponent,
        data: {
          title: 'Return Handling Additional Tc Paging'
        }
      },
      {
        path: PathConstant.RETURN_HANDLING_ADD_TC_DETAIL,
        component: ReturnHandlingAdditionalTcDetailComponent,
        data: {
          title: 'Return Handling Additional Tc Detail'
        }
      },
      // App Dup Check Main Data
      {
        path: PathConstant.APP_DUP_CHECK_MAIN_DATA_PAGING,
        component: DupCheckMdPagingComponent,
        data: { title: 'App Duplicate Check' }
      },
      {
        path: PathConstant.APP_DUP_CHECK_MAIN_DATA_SUBJ_LIST,
        component: DupCheckMdSubjListComponent,
        data: { title: 'App Duplicate Check Subject List' }
      },
      {
        path: PathConstant.APP_DUP_CHECK_MAIN_DATA_SUBJ_MATCH,
        component: DupCheckMdSubjMatchComponent,
        data: { title: 'App Duplicate Check Subject Match' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalProcessSharingRoutingModule { }
