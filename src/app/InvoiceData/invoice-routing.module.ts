import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceDataAddComponent } from './invoice-data-add/invoice-data-add.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Add',
        component: InvoiceDataAddComponent,
        data: {
          title: 'Invoice Data Add'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule { }
