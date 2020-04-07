import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagingComponent } from './paging/paging.component';
import { ApplicantExistingDataCompanyComponent } from './applicant-existing-data-company/applicant-existing-data-company.component';
import { ApplicantExistingDataPersonalComponent } from './applicant-existing-data-personal/applicant-existing-data-personal.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { ListPersonalComponent } from './list-personal/list-personal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AppDupCheckPaging',
        component: PagingComponent,
        data: {
          title: 'App Duplicate Check'
        }        
      },
      {
        path: 'AppDupCheckPersonal',
        component: ListPersonalComponent,
        data: {
          title: 'App Duplicate Check Customer Personal'
        }        
      },
      {
        path: 'AppDupCheckCompany',
        component: ListCompanyComponent,
        data: {
          title: 'App Duplicate Check Customer Company'
        }        
      },
      {
        path: 'ApplicantExistingDataPersonal',
        component: ApplicantExistingDataPersonalComponent,
        data: {
          title: 'Applicant Existing Data Personal'
        }        
      },
      {
        path: 'ApplicantExistingDataCompany',
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
export class AppDupCheckRoutingComponent { }
