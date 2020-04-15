import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';
import { FinancialDataComponent } from './financial-data/financial-data.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'FinancialData',
        component: FinancialDataComponent,
        data: {
          title: 'FinancialData'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FL4WRoutingModule { }
