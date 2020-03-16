import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagingComponent } from './paging/paging.component';
import { AddPersonalComponent } from './add-personal/add-personal.component';
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
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GuarantorRoutingModule { }
