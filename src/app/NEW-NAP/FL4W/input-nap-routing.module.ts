import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyComponent } from './dummy/dummy.component';
import { FinancialDataComponent } from './financial-data/financial-data.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dummy',
        component: DummyComponent,
        data: {
          title: 'dummy'
        }
      },{
        path: 'FinancialData',
        component: FinancialDataComponent,
        data: {
          title: 'Financial Data'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputNapFL4WRoutingModule { }
