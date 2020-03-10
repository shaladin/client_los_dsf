import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToastrComponent } from "./extra/toastr/toastr.component";
import { TypeaheadComponent } from './bootstrap/typeahead/typeahead.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'toastr',
        component: ToastrComponent,
        data: {
          title: 'Toastr'
        }
      },
      {
        path: 'typeahead',
        component: TypeaheadComponent,
        data: {
          title: 'Typeahead'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UIComponentsRoutingModule { }