import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagingComponent } from './paging/paging.component';
import { AddPersonalComponent } from './add-personal/add-personal.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { GuarantorComponent } from './guarantor.component';
const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'paging',
          component: PagingComponent,
          data: {
            title: 'Paging'
          },
        },
        {
          path: 'personal',
          component: AddPersonalComponent,
          data: {
            title: 'Personal'
          },
        },
        {
          path: 'company',
          component: AddCompanyComponent,
          data: {
            title: 'Company'
          },
        },
        {
          path: 'Main',
          component: GuarantorComponent,
          data: {
            title: 'Main'
          },
        },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GuarantorRoutingModule { }
