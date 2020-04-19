import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoExtensionPagingComponent } from './po-extension/po-extension-paging/po-extension-paging.component';
import { PoExtensionDetailComponent } from './po-extension/po-extension-detail/po-extension-detail.component';
import { OutstandingTcPagingComponent } from './outstanding-tc/outstanding-tc-paging/outstanding-tc-paging.component';
import { OutstandingTcDetailComponent } from './outstanding-tc/outstanding-tc-detail/outstanding-tc-detail.component';
import { ReturnHandlingPagingComponent } from './return-handling/return-handling-paging/return-handling-paging.component';
import { ReturnHandlingDetailComponent } from './return-handling/return-handling-detail/return-handling-detail.component';
import { PagingComponent } from './app-dup-check/paging/paging.component';
import { ListPersonalComponent } from './app-dup-check/list-personal/list-personal.component';
import { ListCompanyComponent } from './app-dup-check/list-company/list-company.component';
import { ApplicantExistingDataPersonalComponent } from './app-dup-check/applicant-existing-data-personal/applicant-existing-data-personal.component';
import { ApplicantExistingDataCompanyComponent } from './app-dup-check/applicant-existing-data-company/applicant-existing-data-company.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'POExtension/Paging',
        component: PoExtensionPagingComponent,
        data: {
          title: 'PO Extension Paging'
        }
      },
      {
        path: 'POExtension/Detail',
        component: PoExtensionDetailComponent,
        data: {
          title: 'PO Extension Detail'
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
        path: 'ApplicantExistingData/Personal',
        component: ApplicantExistingDataPersonalComponent,
        data: {
          title: 'Applicant Existing Data Personal'
        }        
      },
      {
        path: 'ApplicantExistingData/Company',
        component: ApplicantExistingDataCompanyComponent,
        data: {
          title: 'Applicant Existing Data Company'
        }        
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalProcessSharingRoutingModule { }
